(function ($) {
  "use strict";





  var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4,
      slideShadows: true
    },
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    keyboard: {
      enabled: true
    },
    mousewheel: {
      thresholdDelta: 30
    },
    breakpoints: {
      768: {
        slidesPerView: 1.5
      },
      992: {
        slidesPerView: 2.5
      },
      1290: {
        slidesPerView: 3
      }
    }
  });


  /*--------------------------------------------------------------
    RegisterPlugin, ScrollTrigger, SplitText
  --------------------------------------------------------------*/
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false
  });





  // AOS Animation
  if ($("[data-aos]").length) {
    AOS.init({
      duration: '1200',
      disable: 'false',
      easing: 'ease',
      mirror: true
    });
  }




  /*--------------------------------------------------------------
    FullHeight
  --------------------------------------------------------------*/
  function fullHeight() {
    $('.full-height').css("height", $(window).height());
  }







  //Main Slider 
  if ($(".main-slider__carousel").length) {
    $(".main-slider__carousel").owlCarousel({
      loop: true,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      margin: 0,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        992: {
          items: 1,
        },
      },
    });
  }




  //Main Slider Two 
  if ($(".main-slider-two__carousel").length) {
    $(".main-slider-two__carousel").owlCarousel({
      loop: true,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      margin: 0,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        992: {
          items: 1,
        },
      },
    });
  }





  //Main Slider Three
  if ($(".main-slider-three__carousel").length) {
    $(".main-slider-three__carousel").owlCarousel({
      loop: true,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      margin: 0,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        992: {
          items: 1,
        },
      },
    });
  }











  //Services One Carousel
  if ($(".services-one__carousel").length) {
    $(".services-one__carousel").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 2,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }

  //Case One Carousel
  if ($(".case-one__carousel").length) {
    $(".case-one__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 2,
        },
        1200: {
          items: 3,
        },
        1344: {
          items: 3,
        },
      },
    });
  }





  //Services One Carousel
  if ($(".testimonial-one__carousel").length) {
    $(".testimonial-one__carousel").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-back"></span>',
        '<span class="icon-arrow-right"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1320: {
          items: 1,
        },
      },
    });
  }





  //BLog One Carousel
  if ($(".blog-one__carousel").length) {
    $(".blog-one__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-back"></span>',
        '<span class="icon-arrow-right"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 2,
        },
        1200: {
          items: 2,
        },
        1320: {
          items: 2.667895,
        },
      },
    });
  }




  //Gallery One Carousel
  if ($(".gallery-one__carousel").length) {
    $(".gallery-one__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1344: {
          items: 4,
        },
      },
    });
  }




  //Brand One Carousel
  if ($(".brand-one__carousel").length) {
    $(".brand-one__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1320: {
          items: 5,
        },
      },
    });
  }




  //Brand Two Carousel
  if ($(".brand-two__carousel").length) {
    $(".brand-two__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1320: {
          items: 5,
        },
      },
    });
  }







  //Case Two Carousel
  if ($(".case-two__carousel").length) {
    $(".case-two__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 2,
        },
        1200: {
          items: 2,
        },
        1320: {
          items: 2,
        },
      },
    });
  }





  //Case Two Carousel
  if ($(".case-three__carousel").length) {
    $(".case-three__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1320: {
          items: 1,
        },
      },
    });
  }


  //Welcome Charity Carousel
  if ($(".welcome-charity__carousel").length) {
    $(".welcome-charity__carousel").owlCarousel({
      loop: true,
      margin: 24,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-back"></span>',
        '<span class="icon-arrow-right"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1344: {
          items: 3,
        },
      },
    });
  }

  // ===Related Products Carousel===
  if ($(".related-products__carousel").length) {
    $(".related-products__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 5000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 4,
        },
      },
    });
  }

  // ===Product All Tab===
  if ($(".product__all-tab").length) {
    $(".product__all-tab .tabs-button-box .tab-btn-item").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));

      if ($(target).hasClass("actve-tab")) {
        return false;
      } else {
        $(".product__all-tab .tabs-button-box .tab-btn-item").removeClass("active-btn-item");
        $(this).addClass("active-btn-item");
        $(".product__all-tab .tabs-content-box .tab-content-box-item").removeClass(
          "tab-content-box-item-active"
        );
        $(target).addClass("tab-content-box-item-active");
      }
    });
  }


  if ($("#shop-details-one__thumb").length) {
    let testimonialsThumb = new Swiper("#shop-details-one__thumb", {
      slidesPerView: 3,
      spaceBetween: 0,
      speed: 1400,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      loop: true,
      autoplay: {
        delay: 5000
      }
    });

    let testimonialsCarousel = new Swiper("#shop-details-one__carousel", {
      observer: true,
      observeParents: true,
      loop: true,
      speed: 1400,
      mousewheel: true,
      slidesPerView: 1,
      autoplay: {
        delay: 5000
      },
      thumbs: {
        swiper: testimonialsThumb
      },
      pagination: {
        el: '#testimonials-one__carousel-pagination',
        type: 'bullets',
        clickable: true
      },

      "navigation": {
        "nextEl": "#product-details__swiper-button-next",
        "prevEl": "#product-details__swiper-button-prev"
      },
    });
  }



  // ===Checkout Payment===
  if ($(".checkout__payment__title").length) {

    $(".checkout__payment__item").find('.checkout__payment__content').hide();
    $(".checkout__payment__item--active").find('.checkout__payment__content').show();

    $(".checkout__payment__title").on("click", function (e) {
      e.preventDefault();


      $(this).parents('.checkout__payment').find('.checkout__payment__item').removeClass("checkout__payment__item--active");
      $(this).parents(".checkout__payment").find(".checkout__payment__content").slideUp();

      $(this).parent().addClass("checkout__payment__item--active");
      $(this).parent().find(".checkout__payment__content").slideDown();

    })
  }



  //Donars One Carousel
  if ($('.donars-one__carousel').length && $('.donars-one__thumb-carousel').length) {

    var bigimage = $(".donars-one__carousel");
    var thumbs = $(".donars-one__thumb-carousel");
    //var totalslides = 10;
    var syncedSecondary = true;

    bigimage
      .owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: true,
        autoplay: true,
        dots: false,
        loop: true,
        navText: [
          '<i class="icon-back" aria-hidden="true"></i>',
          '<i class="icon-arrow-right" aria-hidden="true"></i>'
        ]
      })
      .on("changed.owl.carousel", syncPosition);

    thumbs
      .on("initialized.owl.carousel", function () {
        thumbs
          .find(".owl-item")
          .eq(0)
          .addClass("current");
      })
      .owlCarousel({
        items: 1,
        dots: false,
        nav: false,
        navText: [
          '<i class="icon-back" aria-hidden="true"></i>',
          '<i class="icon-arrow-right" aria-hidden="true"></i>'
        ],
        smartSpeed: 700,
        slideBy: 1,
      })
      .on("changed.owl.carousel", syncPosition2);

    function syncPosition(el) {
      //if loop is set to false, then you have to uncomment the next line
      //var current = el.item.index;

      //to disable loop, comment this block
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }
      //to this
      thumbs
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = thumbs.find(".owl-item.active").length - 1;
      var start = thumbs
        .find(".owl-item.active")
        .first()
        .index();
      var end = thumbs
        .find(".owl-item.active")
        .last()
        .index();

      if (current > end) {
        thumbs.data("owl.carousel").to(current, 500, true);
      }
      if (current < start) {
        thumbs.data("owl.carousel").to(current - onscreen, 500, true);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        bigimage.data("owl.carousel").to(number, 500, true);
      }
    }

    thumbs.on("click", ".owl-item", function (e) {
      e.preventDefault();
      var number = $(this).index();
      bigimage.data("owl.carousel").to(number, 500, true);
    });
  }




  //Testimonial Two Carousel
  if ($('.testimonial-two__carousel').length && $('.testimonial-two__thumb-carousel').length) {

    var bigimage = $(".testimonial-two__carousel");
    var thumbs = $(".testimonial-two__thumb-carousel");
    //var totalslides = 10;
    var syncedSecondary = true;

    bigimage
      .owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: true,
        autoplay: true,
        dots: false,
        loop: true,
        navText: [
          '<i class="icon-back" aria-hidden="true"></i>',
          '<i class="icon-arrow-right" aria-hidden="true"></i>'
        ]
      })
      .on("changed.owl.carousel", syncPosition);

    thumbs
      .on("initialized.owl.carousel", function () {
        thumbs
          .find(".owl-item")
          .eq(0)
          .addClass("current");
      })
      .owlCarousel({
        items: 4,
        dots: false,
        nav: false,
        navText: [
          '<i class="icon-back" aria-hidden="true"></i>',
          '<i class="icon-arrow-right" aria-hidden="true"></i>'
        ],
        smartSpeed: 700,
        slideBy: 4,
      })
      .on("changed.owl.carousel", syncPosition2);

    function syncPosition(el) {
      //if loop is set to false, then you have to uncomment the next line
      //var current = el.item.index;

      //to disable loop, comment this block
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }
      //to this
      thumbs
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = thumbs.find(".owl-item.active").length - 1;
      var start = thumbs
        .find(".owl-item.active")
        .first()
        .index();
      var end = thumbs
        .find(".owl-item.active")
        .last()
        .index();

      if (current > end) {
        thumbs.data("owl.carousel").to(current, 500, true);
      }
      if (current < start) {
        thumbs.data("owl.carousel").to(current - onscreen, 500, true);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        bigimage.data("owl.carousel").to(number, 500, true);
      }
    }

    thumbs.on("click", ".owl-item", function (e) {
      e.preventDefault();
      var number = $(this).index();
      bigimage.data("owl.carousel").to(number, 500, true);
    });
  }







  // custom coursor
  if ($(".custom-cursor").length) {

    var cursor = document.querySelector('.custom-cursor__cursor');
    var cursorinner = document.querySelector('.custom-cursor__cursor-two');
    var a = document.querySelectorAll('a');

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    });

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursorinner.style.left = x + 'px';
      cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function () {
      cursor.classList.add('click');
      cursorinner.classList.add('custom-cursor__innerhover')
    });

    document.addEventListener('mouseup', function () {
      cursor.classList.remove('click')
      cursorinner.classList.remove('custom-cursor__innerhover')
    });

    a.forEach(item => {
      item.addEventListener('mouseover', () => {
        cursor.classList.add('custom-cursor__hover');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('custom-cursor__hover');
      });
    })
  }



  // Add payment amount area start here ***
  $(document).on("click", ".amount-btn", function () {

    $(".amount-btn").removeClass("active");


    $(this).addClass("active");


    let buttonValue = $(this).text();


    $(".addAmount-value").val(buttonValue);
  });





  //Progress Count Bar
  if ($(".count-bar").length) {
    $(".count-bar").appear(
      function () {
        var el = $(this);
        var percent = el.data("percent");
        $(el).css("width", percent).addClass("counted");
      }, {
        accY: -50
      }
    );
  }

  //Progress Bar / Levels
  if ($(".progress-levels .progress-box .bar-fill").length) {
    $(".progress-box .bar-fill").each(
      function () {
        $(".progress-box .bar-fill").appear(function () {
          var progressWidth = $(this).attr("data-percent");
          $(this).css("width", progressWidth + "%");
        });
      }, {
        accY: 0
      }
    );
  }

  //Progress Bar / Levels
  if ($(".progress-levels-2 .progress-box .bar-fill").length) {
    $(".progress-box .bar-fill").each(
      function () {
        $(".progress-box .bar-fill").appear(function () {
          var progressWidth = $(this).attr("data-percent");
          $(this).css("width", progressWidth + "%");
        });
      }, {
        accY: 0
      }
    );
  }


  //Case Three Progress Bar / Levels
  if ($(".case-three__progress-levels .progress-box .bar-fill").length) {
    $(".progress-box .bar-fill").each(
      function () {
        $(".progress-box .bar-fill").appear(function () {
          var progressWidth = $(this).attr("data-percent");
          $(this).css("width", progressWidth + "%");
        });
      }, {
        accY: 0
      }
    );
  }


  if ($(".marquee_mode").length) {
    $('.marquee_mode').marquee({
      speed: 30,
      gap: 0,
      delayBeforeStart: 0,
      direction: 'left',
      duplicated: true,
      pauseOnHover: true,
      startVisible: true,
    });
  }




  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: "linear",
            step: function () {
              $t.find(".count-text").text(Math.floor(this.countNum));
            },
            complete: function () {
              $t.find(".count-text").text(this.countNum);
            }
          });
        }
      }, {
        accY: 0
      }
    );
  }





  // Accrodion
  if ($(".accrodion-grp").length) {
    var accrodionGrp = $(".accrodion-grp");
    accrodionGrp.each(function () {
      var accrodionName = $(this).data("grp-name");
      var Self = $(this);
      var accordion = Self.find(".accrodion");
      Self.addClass(accrodionName);
      Self.find(".accrodion .accrodion-content").hide();
      Self.find(".accrodion.active").find(".accrodion-content").show();
      accordion.each(function () {
        $(this)
          .find(".accrodion-title")
          .on("click", function () {
            if ($(this).parent().hasClass("active") === false) {
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .removeClass("active");
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .find(".accrodion-content")
                .slideUp();
              $(this).parent().addClass("active");
              $(this).parent().find(".accrodion-content").slideDown();
            }
          });
      });
    });
  }



  if ($(".contact-form-validated").length) {
    $(".contact-form-validated").each(function () {
      let self = $(this);
      self.validate({
        // initialize the plugin
        rules: {
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          },
          message: {
            required: true
          },
          subject: {
            required: true
          }
        },
        submitHandler: function (form) {
          // sending value with ajax request
          $.post(
            $(form).attr("action"),
            $(form).serialize(),
            function (response) {
              $(form).parent().find(".result").append(response);
              $(form).find('input[type="text"]').val("");
              $(form).find('input[type="email"]').val("");
              $(form).find("textarea").val("");
            }
          );
          return false;
        }
      });
    });
  }

  // mailchimp form
  if ($(".mc-form").length) {
    $(".mc-form").each(function () {
      var Self = $(this);
      var mcURL = Self.data("url");
      var mcResp = Self.parent().find(".mc-form__response");

      Self.ajaxChimp({
        url: mcURL,
        callback: function (resp) {
          // appending response
          mcResp.append(function () {
            return '<p class="mc-message">' + resp.msg + "</p>";
          });
          // making things based on response
          if (resp.result === "success") {
            // Do stuff
            Self.removeClass("errored").addClass("successed");
            mcResp.removeClass("errored").addClass("successed");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
          if (resp.result === "error") {
            Self.removeClass("successed").addClass("errored");
            mcResp.removeClass("successed").addClass("errored");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
        }
      });
    });
  }

  if ($(".video-popup").length) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,

      fixedContentPos: false
    });
  }

  if ($(".img-popup").length) {
    var groups = {};
    $(".img-popup").each(function () {
      var id = parseInt($(this).attr("data-group"), 10);

      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(this);
    });

    $.each(groups, function () {
      $(this).magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: {
          enabled: true
        }
      });
    });
  }






  function dynamicCurrentMenuClass(selector) {
    let FileName = window.location.href.split("/").reverse()[0];

    selector.find("li").each(function () {
      let anchor = $(this).find("a");
      if ($(anchor).attr("href") == FileName) {
        $(this).addClass("current");
      }
    });
    // if any li has .current elmnt add class
    selector.children("li").each(function () {
      if ($(this).find(".current").length) {
        $(this).addClass("current");
      }
    });
    // if no file name return
    if ("" == FileName) {
      selector.find("li").eq(0).addClass("current");
    }
  }

  if ($(".main-menu__list").length) {
    // dynamic current class
    let mainNavUL = $(".main-menu__list");
    dynamicCurrentMenuClass(mainNavUL);
  }


  if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu__list").outerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }
  if ($(".sticky-header__content").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".sticky-header__content");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .dropdown > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }

  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  //Header Search
  if ($('.searcher-toggler-box').length) {
    $('.searcher-toggler-box').on('click', function () {
      $('body').addClass('search-active');
    });
    $('.close-search').on('click', function () {
      $('body').removeClass('search-active');
    });

    $('.search-popup .color-layer').on('click', function () {
      $('body').removeClass('search-active');
    });
  }


  if ($(".odometer").length) {
    var odo = $(".odometer");
    odo.each(function () {
      $(this).appear(function () {
        var countNumber = $(this).attr("data-count");
        $(this).html(countNumber);
      });
    });
  }

  if ($(".dynamic-year").length) {
    let date = new Date();
    $(".dynamic-year").html(date.getFullYear());
  }

  if ($(".wow").length) {
    var wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // animation css class (default is animated)
      mobile: true, // trigger animations on mobile devices (default is true)
      live: true // act on asynchronously loaded content (default is true)
    });
    wow.init();
  }






  if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));

      if ($(target).is(":visible")) {
        return false;
      } else {
        target
          .parents(".tabs-box")
          .find(".tab-buttons")
          .find(".tab-btn")
          .removeClass("active-btn");
        $(this).addClass("active-btn");
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .fadeOut(0);
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .removeClass("active-tab");
        $(target).fadeIn(300);
        $(target).addClass("active-tab");
      }
    });
  }








  //Case One Tab Tabs
  if ($('.case-one__tabs-box').length) {
    $('.case-one__tabs-box .case-one-tab-btns .p-tab-btn').on('click', function (e) {
      e.preventDefault();
      var target = $($(this).attr('data-tab'));

      if ($(target).hasClass('actve-tab')) {
        return false;
      } else {
        $('.case-one__tabs-box .case-one-tab-btns .p-tab-btn').removeClass('active-btn');
        $(this).addClass('active-btn');
        $('.case-one__tabs-box .p-tabs-content .p-tab').removeClass('active-tab');
        $(target).addClass('active-tab');
      }
    });
  }






  // ===Portfolio===
  function projectMasonaryLayout() {
    if ($(".masonary-layout").length) {
      $(".masonary-layout").isotope({
        layoutMode: "masonry"
      });
    }
    if ($(".post-filter").length) {
      $(".post-filter li")
        .children(".filter-text")
        .on("click", function () {
          var Self = $(this);
          var selector = Self.parent().attr("data-filter");
          $(".post-filter li").removeClass("active");
          Self.parent().addClass("active");
          $(".filter-layout").isotope({
            filter: selector,
            animationOptions: {
              duration: 500,
              easing: "linear",
              queue: false
            }
          });
          return false;
        });
    }

    if ($(".post-filter.has-dynamic-filters-counter").length) {
      // var allItem = $('.single-filter-item').length;
      var activeFilterItem = $(".post-filter.has-dynamic-filters-counter").find(
        "li"
      );
      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this)
          .children(".filter-text")
          .append('<span class="count">' + count + "</span>");
      });
    }
  }









  function SmoothMenuScroll() {
    var anchor = $(".scrollToLink");
    if (anchor.length) {
      anchor.children("a").bind("click", function (event) {
        if ($(window).scrollTop() > 10) {
          var headerH = "90";
        } else {
          var headerH = "90";
        }
        var target = $(this);
        $("html, body")
          .stop()
          .animate({
              scrollTop: $(target.attr("href")).offset().top - headerH + "px"
            },
            200,
            "easeInOutExpo"
          );
        anchor.removeClass("current");
        anchor.removeClass("current-menu-ancestor");
        anchor.removeClass("current_page_item");
        anchor.removeClass("current-menu-parent");
        target.parent().addClass("current");
        event.preventDefault();
      });
    }
  }
  SmoothMenuScroll();

  function OnePageMenuScroll() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 117) {
      var menuAnchor = $(".one-page-scroll-menu .scrollToLink").children("a");
      menuAnchor.each(function () {
        var sections = $(this).attr("href");
        $(sections).each(function () {
          if ($(this).offset().top <= windscroll + 100) {
            var Sectionid = $(sections).attr("id");
            $(".one-page-scroll-menu").find("li").removeClass("current");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-ancestor");
            $(".one-page-scroll-menu").find("li").removeClass("current_page_item");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-parent");
            $(".one-page-scroll-menu")
              .find("a[href*=\\#" + Sectionid + "]")
              .parent()
              .addClass("current");
          }
        });
      });
    } else {
      $(".one-page-scroll-menu li.current").removeClass("current");
      $(".one-page-scroll-menu li:first").addClass("current");
    }
  }






  /*-- Handle Scrollbar --*/
  function handleScrollbar() {
    const bodyHeight = $("body").height();
    const scrollPos = $(window).innerHeight() + $(window).scrollTop();
    let percentage = (scrollPos / bodyHeight) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    $(".scroll-to-top .scroll-to-top__inner").css("width", percentage + "%");
  }




  // Animation gsap 
  function title_animation() {
    var tg_var = jQuery('.sec-title-animation');
    if (!tg_var.length) {
      return;
    }
    const quotes = document.querySelectorAll(".sec-title-animation .title-animation");

    quotes.forEach(quote => {

      //Reset if needed
      if (quote.animation) {
        quote.animation.progress(1).kill();
        quote.split.revert();
      }

      var getclass = quote.closest('.sec-title-animation').className;
      var animation = getclass.split('animation-');
      if (animation[1] == "style4") return

      quote.split = new SplitText(quote, {
        type: "lines,words,chars",
        linesClass: "split-line"
      });
      gsap.set(quote, {
        perspective: 400
      });

      if (animation[1] == "style1") {
        gsap.set(quote.split.chars, {
          opacity: 0,
          y: "90%",
          rotateX: "-40deg"
        });
      }
      if (animation[1] == "style2") {
        gsap.set(quote.split.chars, {
          opacity: 0,
          x: "50"
        });
      }
      if (animation[1] == "style3") {
        gsap.set(quote.split.chars, {
          opacity: 0,
        });
      }
      quote.animation = gsap.to(quote.split.chars, {
        scrollTrigger: {
          trigger: quote,
          start: "top 90%",
        },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: .02
      });
    });
  }
  ScrollTrigger.addEventListener("refresh", title_animation);






  function testimonialBoxSlider() {
    if ($(".testimonial-slider").length > 0) {
      var testimonialSlider = new Swiper('.testimonial-slider', {
        mousewheel: true,
        height: 500,
        grabCursor: true,
        loop: true,
        speed: 1400,
        autoplay: {
          delay: 5000,
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar',
        },
        navigation: {
          nextEl: '.testimonial-slider-button-next',
          prevEl: '.testimonial-slider-button-prev',
        },
        breakpoints: {
          767: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 78,
          },
          922: {
            slidesPerView: 2,
            spaceBetween: 78,
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 78,
          },
          1344: {
            slidesPerView: 2,
            spaceBetween: 78,
          }
        },
      });
      testimonialSlider.on('slideChange', function () {
        var csli = testimonialSlider.realIndex + 1,
          curnum = $('#current');
        TweenMax.to(curnum, 0.2, {
          force3D: true,
          y: -10,
          opacity: 0,
          ease: Power2.easeOut,
          onComplete: function () {
            TweenMax.to(curnum, 0.1, {
              force3D: true,
              y: 10
            });
            curnum.html('0' + csli);
          }
        });
        TweenMax.to(curnum, 0.2, {
          force3D: true,
          y: 0,
          delay: 0.3,
          opacity: 1,
          ease: Power2.easeOut
        });
      });

      var totalSlides = testimonialSlider.slides.length - 2;
      $('#total').html('0' + totalSlides);
    }


  }






  // Price Filter
  function priceFilter() {
    if ($(".price-ranger").length) {
      $(".price-ranger #slider-range").slider({
        range: true,
        min: 50,
        max: 500,
        values: [11, 300],
        slide: function (event, ui) {
          $(".price-ranger .ranger-min-max-block .min").val(
            "$" + ui.values[0]
          );
          $(".price-ranger .ranger-min-max-block .max").val(
            "$" + ui.values[1]
          );
        },
      });
      $(".price-ranger .ranger-min-max-block .min").val(
        "$" + $(".price-ranger #slider-range").slider("values", 0)
      );
      $(".price-ranger .ranger-min-max-block .max").val(
        "$" + $(".price-ranger #slider-range").slider("values", 1)
      );
    }
  }




  $(".add").on("click", function () {
    if ($(this).prev().val() < 999) {
      $(this)
        .prev()
        .val(+$(this).prev().val() + 1);
    }
  });
  $(".sub").on("click", function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1)
        $(this)
        .next()
        .val(+$(this).next().val() - 1);
    }
  });








  // window load event
  $(window).on("load", function () {
    if ($(".preloader").length) {
      $(".preloader").fadeOut();
    }

    projectMasonaryLayout();
    fullHeight();
    title_animation();
    testimonialBoxSlider();
    priceFilter();




    if ($(".post-filter").length) {
      var postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        var Self = $(this);
        var selector = Self.attr("data-filter");
        postFilterList.removeClass("active");
        Self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }

    if ($(".post-filter.has-dynamic-filter-counter").length) {
      // var allItem = $('.single-filter-item').length;

      var activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
        "li"
      );

      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this).append("<sup>[" + count + "]</sup>");
      });
    }






    // Curved Circle
    if ($(".video-one__curved-circle").length) {
      $(".video-one__curved-circle").circleType({
        position: "absolute",
        dir: 1,
        radius: 100,
        forceHeight: true,
        forceWidth: true,
      });
    }




    // Curved Circle
    if ($(".need-help__curved-circle").length) {
      $(".need-help__curved-circle").circleType({
        position: "absolute",
        dir: 1,
        radius: 73,
        forceHeight: true,
        forceWidth: true,
      });
    }



    // Type Effect
    if ($('.typed-effect').length) {
      $('.typed-effect').each(function () {
        var typedStrings = $(this).data('strings');
        var typedTag = $(this).attr('id');
        var typed = new Typed('#' + typedTag, {
          typeSpeed: 100,
          backSpeed: 100,
          fadeOut: true,
          loop: true,
          strings: typedStrings.split(',')
        });
      });

    }





  });

  // window scroll event

  $(window).on("scroll", function () {
    if ($(".stricked-menu").length) {
      var headerScrollPos = 130;
      var stricky = $(".stricked-menu");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("stricky-fixed");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("stricky-fixed");
      }
    }

    OnePageMenuScroll();

  });

  $(window).on("scroll", function () {
    handleScrollbar();
    if ($(".sticky-header--one-page").length) {
      var headerScrollPos = 130;
      var stricky = $(".sticky-header--one-page");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("active");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("active");
      }
    }

    var scrollToTopBtn = ".scroll-to-top";
    if (scrollToTopBtn.length) {
      if ($(window).scrollTop() > 500) {
        $(scrollToTopBtn).addClass("show");
      } else {
        $(scrollToTopBtn).removeClass("show");
      }
    }
  });





  jQuery(document).ready(function ($) {
    var player = document.querySelector('audio');
    var $play_button = $('.play');
    var $pause_button = $('.pause');
    var $bar = $('.bar');
    var update_time;

    function startNupdate() {
      document.querySelector('audio').pause();
      player.play();
      $play_button.hide();
      $pause_button.show();

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      clearInterval(update_time);
      update_time = setInterval(function () {
        var gradients = '';
        for (var i = 0; i < player.buffered.length; i++) {
          var perc_start = ((player.buffered.start(i) / player.duration) * 100).toString();
          var perc_end = ((player.buffered.end(i) / player.duration) * 100).toString();

          if (i > 0) {
            gradients = gradients + ',rgba(240,240,240) ' + perc_start + '%,#9D9D9D ' + perc_start + '%' +
              ', #9D9D9D ' + perc_end + '%, rgba(240,240,240) ' + perc_end + '%'
          } else {
            gradients = gradients + '#9D9D9D ' + perc_start + '%' + ', #9D9D9D ' + perc_end +
              '%, rgba(240,240,240) ' + perc_end + '%'
          }
        }
        gradients = gradients + ',rgba(240,240,240) ' + ((player.buffered.end(player.buffered.length - 1) / player
          .duration) * 100) + '%, rgba(240,240,240)'
        $bar.css({
          "background": "linear-gradient(to right, #F0F0F0, " + gradients + ")"
        })
        var minutes = pad(Math.floor(player.currentTime / 60), 2);
        var seconds = pad(Math.floor(player.currentTime - minutes * 60), 2);
        $('.elapsed span').html(minutes + ':' + seconds);
        $('.position-marker').css({
          "left": ((player.currentTime / player.duration) * 100) + '%'
        })
      }, 1000)
    }

    $bar.on('click', function (event) {
      var pos_perc = event.offsetX / event.target.offsetWidth;
      player.currentTime = (player.duration * pos_perc);
      startNupdate();
    })

    $play_button.on('click', function () {
      startNupdate();
    });
    $pause_button.on('click', function () {
      player.pause();
      $pause_button.hide();
      $play_button.show();
      clearInterval(update_time);
    });
  })





  $('select:not(.ignore)').niceSelect();



})(jQuery);