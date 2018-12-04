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
    showMessage("supported formats: avi | wmv | flv | mpg | mp4");
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

    // file upload code goes here
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
        vm.show_loader = true;
        vm.show_video = true;
        showMessage("Processing the video. Please wait... ");
        if(data.result.hashed_id)
          getPlaybackMedia(data.result.hashed_id);
        else 
          showMessage("Error getting the video for playback!"); 
      },
      fail: function (e, data) {
        // clear the videoes if it's 403 and retry uploading
        if (data.jqXHR.status == 403) {
          showMessage("The account has reached the video upload limit. Please wait while we clear the videoes...");
          clearVideosForUpload(data);
        }
      },
      progressall: function (e, data) {
        // update the progress
        uploadProgressAll(data);
      }
    });


    function clearVideosForUpload(data) {

      // Delete the selected media from Wistia bucket
      function deleteMedia(id, i) {
        var config = {
          params: {
            'api_password': CONSTANTS.WISTIA.password,
          }
        };
        $http.delete(CONSTANTS.WISTIA.mediaActionUrl+id+'.json', config).then(function (res) {
          // start uploading the video once the video count goes below 3
          if (i == 0)
            data.submit();
        }, function (err) {
            showMessage("Oops again! Error while deleting the media");
        });
      }

      return (function () {
        var config = {
          params: {
            'api_password': CONSTANTS.WISTIA.password,
            'project_id': CONSTANTS.WISTIA.projectId
          }
        };
        $http.get(CONSTANTS.WISTIA.mediaUrl, config).then(function (res) {
          for (var i = 0; i < res.data.length; i++) {
            deleteMedia(res.data[i].id, i);
          }
        }, function (err) {
            showMessage("Oops again! Error while fetching the media list.");
        });
      }());
    }


    function checkFileTypes(data) {
      var accepted_file_types = /^video\/\.*(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/;
      if (data.originalFiles.length > 1) {
          showMessage("Upload failed! Please upload one video at a time");
        return;
      }
      if (data.originalFiles[0]['type'].length && !accepted_file_types.test(data.originalFiles[0]['type'])) {
          showMessage("Upload failed! Unsupported file type.");
        return;
      }
      
      data.submit();        
      
    }


    function uploadProgressAll(data) {
      vm.show_loader = true;
      showMessage("Video is being uploaded. Please wait...");
      var progress = parseInt(data.loaded / data.total * 100, 10);
      $timeout(function () {
        vm.progress = {
          width: progress + '%'
        };
      }, 0);
    }

    function showMessage(msg) {
      $timeout(function () { 
        vm.uploader_message = msg;
      }, 0);
    }


    function getPlaybackMedia(hashed_id) {
      
      var params = {
        api_password: CONSTANTS.WISTIA.password,
        hashed_id: hashed_id
      };
      var iframe_html = '<iframe src="' + CONSTANTS.WISTIA.embedUrl + hashed_id + '" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen allowtransparency="true" frameborder="0" scrolling="no" class="embed-responsive-item" name="wistia_embed"></iframe>';
      
      $http.get(CONSTANTS.WISTIA.mediaUrl, { params: params }).then(function(res) {
        
        $timeout(function(){
          // update progress
          vm.progress.width = parseInt(res.data[0].progress * 100, 10) + '%';
          vm.video_preview_html = $sce.trustAsHtml(iframe_html);
        }, 0);

        // retry every 2 seconds if the status is still queued
        if (res.data[0].status == "queued") {  
          $timeout(function () {
            getPlaybackMedia(hashed_id);
          }, 2000);

          return;
        }
  
        showMessage(res.data[0].name);
        
        vm.show_loader = false;
      }, function (err) {
          vm.show_loader = false;
          vm.show_video = false;
          showMessage("Oops! Something went wrong!");
      });
    }
  }

})(window.angular, window.jQuery);
