window.onload = function () {
    var
        oBox       = $('#box'),
        aPbl     = $('#box .pbl'),
        oLoading   = $('#loading'),
        iLoadingH  = 30,
        iColNum    = 3,
        iPblW    = 260,
        aColH      = [],
        iWindowW   = document.documentElement.clientWidth,
        iWindowH   = document.documentElement.clientHeight,
        bBtn       = true;

    // 页面初始化布局
    aPbl.each(function (k, v) {
        if(k < 3) {
            $(v).css({
                left: k * iPblW,
                top: 0
            });
            aColH.push($(v).height());
        }else {
            // 获取最小高度以及对应的key
            var
                iMinK = 0,
                iMinH = Math.min.apply(null, aColH);

            aColH.forEach(function (v, k) {
                if(v === iMinH) {
                    iMinK = k;
                }
            });

            $(v).css({
                left: iMinK * iPblW,
                top: iMinH
            });

            aColH[iMinK] += $(v).height();
        }
    });

    // 添加滚动事件
    $(window).scroll(function () {
        var
            iScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            oLastPbl= aPbl.eq(aPbl.length - 1),
            iCrticalPoint = parseInt(oLastPbl.css('top')) + oLastPbl.height() - iLoadingH;
        if(bBtn && (iWindowH + iScrollTop) >= iCrticalPoint) {
            $.ajax({
                url: 'http://localhost/waterfall.php',
                dataType: 'json',
                beforeSend: function () {
                    bBtn = false;
                    oLoading.css({
                        display: 'block',
                        left: (iWindowW - iLoadingH ) / 2 ,
                        top: iCrticalPoint,
                    });
                },
                success: function (data) {
                    data.forEach(function (v, k) {
                        oBox.append('<div class="pbl"><a href="javascript:;"><img src="' + v.url + '" alt=""></a></div>');
                        var
                            iMinK = 0,
                            iMinH = Math.min.apply(null, aColH);

                        aColH.forEach(function (v, k) {
                            if(v === iMinH) {
                                iMinK = k;
                            }
                        });
                        var oLast = oBox.find('.pbl').last();

                        // 设置起始位置
                        /*oLast.css({
                         left: (iWindowW - iPanelW ) /2,
                         top: iWindowH + iScrollTop
                         }).animate({
                         left: iMinK * iPanelW,
                         top: iMinH
                         });*/
                        oLast.css({
                            left: iMinK * iPblW,
                            top: iMinH,
                            opacity: 0
                        }).animate({
                            opacity: 1
                        }, 1000);

                        aColH[iMinK] += oLast.height();
                    });
                },
                complete: function () {
                    aPbl = $('#box .pbl');
                    bBtn = true;
                    oLoading.css({
                        display: 'none'
                    });
                }
            });
        }
    });
}
