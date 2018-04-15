; (function (angular, $) {

  'use strict';

  angular
    .module('boilerplate')
    .component('fileUploader', {
      templateUrl: 'app/upload/upload.html',
      controller: UploaderCtrl,
      controllerAs: 'vm'
    });


  UploaderCtrl.$inject = ['$element', '$attrs', '$http', '$timeout', '$sce', 'CONSTANTS'];


  function UploaderCtrl($element, $attrs, $http, $timeout, $sce, CONSTANTS) {
    var vm = this;
    var date = new Date();

    vm.file_name = '';
    vm.uploader_message = "supported formats: avi | wmv | flv | mpg | mp4";
    vm.progress = {
      width: 0 + '%'
    };
    vm.show_loader = false;
    vm.show_video = false;

    // set the form data
    var form_data = [
      {
        name: 'api_password',
        value: CONSTANTS.WISTIA.password
      }, {
        name: 'name',
        value: vm.file_name || CONSTANTS.WISTIA.namePrefix + date.getTime()
      },
      {
        name: 'project_id',
        value: CONSTANTS.WISTIA.projectId
      }
    ];

    $($element).fileupload({
      url: CONSTANTS.WISTIA.url,
      autoUpload: false,
      dataType: 'json',
      dropZone: $($element),
      paramName: 'file',
      formData: form_data,
      add: function (e, data) {
        checkFileTypes(data);
      },
      done: function (e, data) {
        // call the media api to fetch the video
        getPlaybackMedia(data);
      },
      fail: function (e, data) {
        // clear the videoes if it's 403 and retry uploading
        if (data.jqXHR.status == 403) {
          clearVideosForUpload(data);
        }
      },
      progressall: function (e, data) {
        // update the progress
        uploadProgressAll(data);
      }
    });


    function clearVideosForUpload(data) {
      $timeout(function () {
        vm.uploader_message = "The account has reached the video upload limit. Please wait while we clear the videoes...";
      }, 0);
      var config = {
        params: {
          'api_password': CONSTANTS.WISTIA.password,
          'project_id': CONSTANTS.WISTIA.projectId
        }
      };
      $http.get(CONSTANTS.WISTIA.mediaUrl, config).then(function (res) {
        console.log(res);
        for (var i = 0; i < res.data.length; i++){
          deleteMedia(res.data[i].id);
          if (i < 2) {
            console.log("data.submit");
            console.log(data);
            data.submit();
          }
        }
      }, function (err) {
        $timeout(function () {
          console.log("Oops again! Error while fetching the media list.");
        }, 0);
      });
    }


    function deleteMedia(id) {
      var config = {
        params: {
          'api_password': CONSTANTS.WISTIA.password,
        }
      };
      $http.delete(CONSTANTS.WISTIA.mediaActionUrl+id+'.json', config).then(function (res) {
        // do nothing
      }, function (err) {
        $timeout(function () {
          vm.uploader_message = "Oops again! Error while deleting the media";
        }, 0);
      });
    }


    function checkFileTypes(data) {
      var accepted_file_types = /^video\/\.*(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/;
      if (data.originalFiles.length > 1) {
        $timeout(function () {
          vm.uploader_message = "Upload failed! Please upload one video at a time";
        }, 0);
        return;
      }
      if (data.originalFiles[0]['type'].length && !accepted_file_types.test(data.originalFiles[0]['type'])) {
        $timeout(function () {
          vm.uploader_message = "Upload failed! Unsupported file type.";
        }, 0);
        return;
      }
      
      data.submit();        
      
    }


    function uploadProgressAll(data) {
      vm.show_loader = true;
      vm.uploader_message = "Video is being uploaded. Please wait...";
      var progress = parseInt(data.loaded / data.total * 100, 10);
      $timeout(function () {
        vm.progress = {
          width: progress + '%'
        };
      }, 0);
    }


    function getPlaybackMedia(data) {

      function success(res) {
        // check progress
        var progress = parseInt(res.data[0].progress * 100, 10);
        var image_html = '<img src="' + res.data[0].thumbnail.url + '" style="width: 100%; height: 360px; background-color: #000">';
        var iframe_html = '<iframe src="' + CONSTANTS.WISTIA.embedUrl + id + '" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" style="width: 100%; height: 360px"></iframe>';
  
        
        // retry if not completed
        if (progress < 100) {
  
          $timeout(function () {
            vm.show_video = true;
            vm.video_name = res.data[0].name;
            vm.progress.width = progress+'%';            
            vm.video_preview_html = $sce.trustAsHtml(image_html);
          }, 0);
  
          // retry until video processing completes
          $timeout(function () {
            $http.get(CONSTANTS.WISTIA.mediaUrl, { params: params }).then(success, error);
          }, 1000 * 5);

          return;
        }
  
        $timeout(function () {
          vm.video_preview_html = $sce.trustAsHtml(iframe_html);
          vm.uploader_message = "Ready!";
          vm.show_loader = false;
        }, 0);
      }
  

      function error(err) {
        $timeout(function () {
          vm.show_loader = false;
          vm.show_video = false;
          vm.uploader_message = "Oops! Something went wrong!";
        }, 0);
      }

      vm.show_loader = true;
      vm.uploader_message = "Processing the video. Please wait... ";
      var id = data.result.hashed_id;
      var params = {
        api_password: CONSTANTS.WISTIA.password,
        hashed_id: id
      };
      $http.get(CONSTANTS.WISTIA.mediaUrl, { params: params }).then(success, error);
    }

  }

})(window.angular, window.jQuery);
