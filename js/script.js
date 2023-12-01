$(window).on('load', function() {
  $(".preloader").fadeOut();

});
$(document).ready(function() {
  new WOW().init();

  //phone size menu onclick
  if ($(window).width() <= 991) {
      $("#menu-id").click(function(e) {
          e.preventDefault();
          $('.menu-bars .bar').toggleClass('hide-icon');
          $('.menu-bars .times').toggleClass('hide-icon');
          $(".navgition").toggleClass("reset-left");
          $("body").toggleClass("overflow");

      });
      $(".nav-head .close-btn").click(function() {
          $(".navgition").removeClass("reset-left");
          $(".menu-bars .bars").toggleClass("open-bars");
          $(".menu-bars .bars").toggleClass("close-bars");
          $("body").removeClass("overflow");
      });




     
  };

  //fixed nav
//   $stickyNav = $(".top-header");
//   $(window).scroll("scroll load", function() {
//       var scroll = $(window).scrollTop();
//       if (scroll >= 112) {
//           $stickyNav.addClass("fixed-nav", 500);
//       } else {
//           $stickyNav.removeClass("fixed-nav", 500);
//       }
//       if (scroll == 0) {
//           $stickyNav.removeClass("fixed-nav", 500);
//       }
//   });
//   var $stickyheader = $("header");
//   lastScroll = 0;
//   $(window).scroll("scroll load", function() {
//       var scroll = $(window).scrollTop();
//       if (lastScroll - scroll > 0) {
//           $stickyheader.addClass("fixed-header", {
//               duration: 1000
//           });
//       } else if (lastScroll - scroll >= 0 && $(window).width() <= 991) {
//           $stickyheader.addClass("fixed-header", {
//               duration: 1000
//           });
//       } else {
//           $stickyheader.removeClass("fixed-header", {
//               duration: 500
//           });
//       }
//       lastScroll = scroll;
//       if (scroll == 0) {
//           $stickyheader.removeClass("fixed-header", {
//               duration: 500
//           });
//       }
//   });

$(document).on('mouseenter', '.divbutton', function () {
  $(this).find(":button").show();
}).on('mouseleave', '.divbutton', function () {
  $(this).find(":button").hide();
}).on('click', ':button', function() {
  $(this).parent().remove();
});

  ///////// ** upload images ** /////////



  ImgUpload();


  function ImgUpload() {
      var imgWrap = "";
      var imgArray = [];

      $('.upload__inputfile').each(function() {
          $(this).on('change', function(e) {
              imgWrap = $(this).closest('.upload__box').find('.upload__img-wrap');
              var maxLength = $(this).attr('data-max_length');

              var files = e.target.files;
              var filesArr = Array.prototype.slice.call(files);
              var iterator = 0;
              filesArr.forEach(function(f, index) {

                  if (!f.type.match('image.*')) {
                      return;
                  }

                  if (imgArray.length > maxLength) {
                      return false
                  } else {
                      var len = 0;
                      for (var i = 0; i < imgArray.length; i++) {
                          if (imgArray[i] !== undefined) {
                              len++;
                          }
                      }
                      if (len > maxLength) {
                          return false;
                      } else {
                          imgArray.push(f);

                          var reader = new FileReader();
                          reader.onload = function(e) {
                              var html = "<div class='upload__img-box'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                              imgWrap.append(html);
                              iterator++;
                          }
                          reader.readAsDataURL(f);
                      }
                  }
              });
          });
      });

      $('body').on('click', ".upload__img-close", function(e) {
          var file = $(this).parent().data("file");
          for (var i = 0; i < imgArray.length; i++) {
              if (imgArray[i].name === file) {
                  imgArray.splice(i, 1);
                  break;
              }
          }
          $(this).parent().parent().remove();
      });
  }

  $('input[type=file]').change(function() {
      var filename = $(this).val().split('\\').pop();
      var idname = $(this).attr('id');
      console.log($(this));
      console.log(filename);
      console.log(idname);
      $('label').find('span').html(filename);

  });


//////////////////////////////// chat box ///////////////////////////////////////
var element = $('.floating-chat');
var myStorage = localStorage;

if (!myStorage.getItem('chatID')) {
    myStorage.setItem('chatID', createUUID());
}

setTimeout(function() {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    var strLength = textInput.val().length * 2;
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function() {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function sendNewMessage() {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) return;

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="self">',
        newMessage,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}


////////////////////////// textarea editor   //////////////////////////////////////////
//WSYJA
(function(window){
    /**
    **  To use start with the 'init(conatiner_id/container_class)'
    **
    **
    **/
    // You can enable the strict mode commenting the following line  
   //'use strict';
  
    // Main library 
    function myLibrary(){
      let _myLibraryObject = {};
      //  Private variables
      let defaults = {
        container: null,
        html: `<div id="code-editor">
                <div class="editor-block-controls">
                  <div>
                      <button class="command" title="Undo" data-command='undo'><i class="las la-undo"></i></button>
                      <button class="command" title="Redo" data-command='redo'><i class="las la-redo"></i></button>
                  </div>
                  <div>
                    <button class="command" title="Title" data-command='italic'><i class="las la-italic"></i></button>
                    <button class="command" title="Bold" data-command='bold'><i class="las la-bold"></i></button>
                    <button class="command" title="Horizontal Rule" data-command="insertHorizontalRule">Hr</button>
                    <button class='command' title="Strike-Through" data-command='strikethrough'><strike>abc</strike></button>
                    <button class="command" title="H1" data-command='h1'>H1</button>
                    <button class="command" title="H2" data-command='h2'>H2</button>
                    <button class="command" title="Underline" data-command='underline'>U</button>
                    <button  class="command" title="Paragraph" data-command="p"><i class="las la-paragraph"></i></button>
                  </div>
                  <div>
                    <button  class="command" title="Indent" data-command="indent"><i class="las la-indent"></i></button>
                    <button  class="command" title="Outdent" data-command="outdent"><i class="las la-outdent"></i></button>
                  </div>
                  <div>
                    <button class="command" title="Justify-Left" data-command='justifyleft'><i class="las la-align-left"></i>></button>
                    <button class="command" title="Justify-Center" data-command='justifycenter'><i class="las la-align-justify"></i></button>
                    <button class="command" title="Justify-Right" data-command='justifyright'><i class="las la-align-right"></i></button>
                  </div>
                </div>
                <div class="editor-block-controls">
                  <div>
                     <button class="command" title="Blockquote" data-command='formatBlock'><i class="las la-quote-right"></i></button>
                    <button class="command" title="Superscript" data-command='superscript'>A<sup>abc</sup></button>
                    <button class="command" title="Blockquote" data-command='subscript'>A<sub>abc</sub></button>
                  </div>
                  <div>
                    <button class="command" title="Decrease font" data-command='decreasefontsize'><sub>A</sub></button>
                    <button class="command" title="Increase font" data-command='increasefontsize'><i class="fas fa-font"></i></button>
                  </div>
                  <div>
                    <select class="wsy-command" title="Font size">
                      <option value="1">small</option>
                      <option value="2">normal</option>
                      <option value="3">medium</option>
                      <option value="4">large</option>
                      <option value="5">x-large</option>
                      <option value="6">xx-large</option>
                      <option value="7">xxx-large</option>
                    </select>
                  </div>
                </div>
              <div id="editor-block-content" contenteditable></div>
              </div>`
      };
  
      // Methods of myLibrary
      _myLibraryObject.init = function(container){
            defaults.container = document.querySelector(container);
            _myLibraryObject.setUI();
            _myLibraryObject.setListeners();
            return defaults.container;
      };
      
      _myLibraryObject.setUI = function(){
        if(defaults.container !== null && defaults.container)
          defaults.container.innerHTML = defaults.html;  
      };
      
      _myLibraryObject.setListeners = function(){
        for(let el of defaults.container.querySelectorAll('button.command')){
            el.addEventListener('mousedown', function(e){
                    let command = e.currentTarget.getAttribute('data-command');
                  switch(command) {
                          case 'h1':
                          case 'h2':
                          case 'p':
                            document.execCommand('formatBlock', false, command);
                            break;
                          case 'formatBlock': 
                            document.execCommand('formatBlock', false, "blockquote");
                            break;
                          case 'increasefontsize': 
                            document.execCommand('fontSize', false, 5);
                            break;
                          case 'decreasefontsize': 
                            document.execCommand('fontSize', false, 2);
                            break;
                          default:
                            document.execCommand(command, false, command);
                            break;
                        }
                });
        }
        defaults.container.querySelector('select').addEventListener('change',(e)=>{
          document.execCommand('fontSize', false, e.target.value); 
        });
         
      };
      
      return _myLibraryObject;
    }
  
    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.wsyJA) === 'undefined'){
      window.wsyJA = myLibrary();
    }
  })(window);
  
  wsyJA.init('.wsyig');
  ////////////** footer transfer into accordion **//////////

 
  $('.footer-accordion').click(function() {
      const x = `${$(this).siblings().prop('scrollHeight') + 15}px`;
      $('.footer-accordion').not(this).removeClass('active');
      $(this).toggleClass('active');
      if ($(this).siblings().css('max-height') == '0px') {
          $(this).siblings().css('max-height', x);
          $(this).siblings('.nav-foot').css('padding-top', '15px');
      } else {
          $(this).siblings().css('max-height', '0');
          $(this).siblings('.nav-foot').css('padding-top', '0');
      }

      $('.footer-accordion').not(this).siblings().css('max-height', '0');
      $('.footer-accordion')
          .not(this)
          .siblings('.nav-foot')
          .css('padding-top', '0');
  });
  //////////** fixed arrow to top**//////////
  $(".arrow-top").click(function() {
      $("html,body").animate({
              scrollTop: 0,
          },
          1500
      );
  });
  $(this).scrollTop() >= 500 ?
      $(".arrow-top").fadeIn(300) :
      $(".arrow-top").fadeOut(300);

  $(window).scroll(function() {
      $(this).scrollTop() >= 500 ?
          $(".arrow-top").fadeIn(300) :
          $(".arrow-top").fadeOut(300);
  })



});