/**
 * Description placeholder
 *
 * @type {{ down: number; move: number; up: number; downAndMove: number; pinch: number; }}
 */
const mousePointingSituations = {
    down: 0,
    move: 1,
    up: 2,
    downAndMove: 3,
    pinch:4
}

/**
 * Description placeholder
 *
 * @type {{ Normal: number; PlusMinus: number; Fig: number; SymbolPoint: number; LabelPoint: number; RangePrint: number; Accessory_Drag: number; Distance: number; od: number; DistanceObject: number; MultiObjectSelect: number; }}
 */
const enmPrintMouseMode = {
    Normal: 0,
    PlusMinus: 1,
    Fig: 2,
    SymbolPoint: 3,
    LabelPoint: 4,
    RangePrint: 5,
    Accessory_Drag: 7,
    Distance: 9,
    od: 10,
    DistanceObject: 11,
    MultiObjectSelect: 12
}

/**
 * Description placeholder
 *
 * @type {{ NoAccessory: number; Title: number; Compass: number; Scale: number; Legend: number; GroupBox: number; Note: number; }}
 */
const Check_Acc_Result = {
    NoAccessory: 0,
    Title: 1,
    Compass: 2,
    Scale: 3,
    Legend: 4,
    GroupBox: 5,
    Note: 6
}

/**
 * Description placeholder
 *
 * @param {*} elem 
 * @param {*} callback 
 */
var mapMouse = function (elem: any, callback: any) {

    let MouseDownF = false;
    let mousePointingSituation = mousePointingSituations.up;
    let mouseDownPosition: any;
    let mousePreviousPosition: any;
    let touchStartTime: any;
    elem.addEventListener("mousedown", mdown, false);
    elem.addEventListener("touchstart", mdown, {passive:false});
    elem.addEventListener("mousemove", mmove, false);
    elem.addEventListener("touchmove", mmove, {passive:false});
    elem.addEventListener("mouseup", mup, false);
    elem.addEventListener("touchend", mup, {passive:false});
    elem.addEventListener("mouseleave", mup, false);
    let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    elem.addEventListener(mousewheelevent, onWheel, false);
    var g = elem.getContext('2d');

    //出力画面でのキー操作
    document.addEventListener('keydown', function (e) {
        let elm = document.getElementsByName("backDiv");
        if (elm.length == 0) {
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            if (Frm_Print.style.zIndex == 2) {
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                if (Frm_Print.getVisibility() == true) {
                    keyOperation(e.keyCode, e.shiftKey, e.ctrlKey);
                }
            }else{
            }
        }
    });
    document.addEventListener('keyup', function (e) {
        let elm = document.getElementsByName("backDiv");
        if (elm.length == 0) {
            if (e.keyCode == 13) {
                if (settingModeWindow.style.zIndex == 2) {
                    //設定画面でEnterを押すと描画開始ボタンにフォーカス移動
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    document.getElementById("btnDraw").focus();
                }
            }
        }
    });

    function keyOperation(keyCode: any, shiftKey: any, ctrlKey: any) {
        if (mousePointingSituation != mousePointingSituations.up) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle.ScrData.ScrView;
        let w = vs.width();
        let h = vs.height();
        switch (keyCode) {
            case 82: //Rキー
                frmPrint.wholeMapShow();
            case 37:
            case 38:
            case 39:
            case 40: {
                let xmove = 0;
                let ymove = 0;
                if ((keyCode == 37) || (keyCode == 39)) {
                    xmove = (keyCode - 38) * w / 5;
                }
                if ((keyCode == 38) || (keyCode == 40)) {
                    ymove = (keyCode - 39) * h / 5;
                }
                if ((shiftKey == true) && (ctrlKey == true)) {
                    xmove /= 8;
                    ymove /= 8;
                } else {
                    if (shiftKey == true) {
                        xmove /= 2;
                        ymove /= 2;
                    }
                    if (ctrlKey == true) {
                        xmove /= 4;
                        ymove /= 4;
                    }
                }
                vs.offset(xmove, ymove);
                callback(elem);
                break;
            }
            case 33:
            case 34: {
                let bairitsu;

                if (keyCode == 34) {
                    bairitsu = 0.4;
                } else {
                    bairitsu = -0.4;
                }
                if ((shiftKey == true) && (ctrlKey == true)) {
                    bairitsu /= 8;
                } else {
                    if (shiftKey == true) {
                        bairitsu /= 2;
                    }
                    if (ctrlKey == true) {
                        bairitsu /= 4;
                    }
                }
                let ratio = 1 - bairitsu;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                expansionMap(attrData.TotalData.ViewStyle.ScrData.getSXSY_Margin().centerP(), ratio);             
                break;
            }
        }
    }

    function mdown(e: any) {
        e.preventDefault();
        let event;
        if (e.type === "mousedown") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }
        MouseDownF = true;
        touchStartTime=new Date().getTime();
        mousePointingSituation = mousePointingSituations.down;
        mouseDownPosition = Generic.getCanvasXY(event);

    }


    function mmove(e: any) {
        let event;
        e.preventDefault();
        if (e.type === "mousemove") {
             event = e;
        } else {
            if(mousePointingSituation == mousePointingSituations.pinch){
                pinchMove(e);
                return;
            }
            if( e.changedTouches.length>1){
                e.preventDefault();
                mousePointingSituation = mousePointingSituations.pinch;
                pinch(e);
                return;
            }else{
                event = e.changedTouches[0];
            }
        }
        let p = Generic.getCanvasXY(event);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle;
        let MapPos = vs.ScrData.getSRXY(p);
        switch (mousePointingSituation) {
            case mousePointingSituations.up: {
                //ボタンを押さずに移動中
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                    case enmPrintMouseMode.od:
                    case enmPrintMouseMode.Normal: {
                        let mCursorF = false;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F == false) {
                            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                            if (propertyWindow.fixed == false) {
                                LocationSearch(p);
                            } else {
                                //picMapMouseMovePointInformation(p);
                            }
                            LocationContourSearch(p);
                            mCursorF = LocationODSearch(p);
                        }
                        if (mCursorF == false) {
                            if (Check_Acc(p).type != Check_Acc_Result.NoAccessory) {
                                mCursorF = true;
                            }
                        }
                        if (mCursorF == true) {
                            elem.style.cursor = 'pointer';
                        } else {
                            elem.style.cursor = 'default';
                        }
                        break;
                    }
                }
                break;
            }
            case mousePointingSituations.down: {
                //マウスダウンの直後
                if (p.Equals(mouseDownPosition) == false) {
                    mousePreviousPosition = p;
                    mousePointingSituation = mousePointingSituations.downAndMove;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.Normal: {
                            let retv = Check_Acc(p);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.frmPrint_Temp.mouseAccesoryDragType = retv.type;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType != Check_Acc_Result.NoAccessory) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Accessory_Drag;
                                elem.style.cursor = 'move';
                            }
                            break;
                        }
                        case enmPrintMouseMode.Fig: {
                            break;
                        }
                    }
                }
                break;
            }
            case mousePointingSituations.downAndMove: {
                //マウスダウンとドラッグ開始後
                if (p.Equals(mousePreviousPosition) == false) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let vs = attrData.TotalData.ViewStyle;
                    let MouseDownSRxy = vs.ScrData.getSRXY(mouseDownPosition);
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let movePx = new point(p.x - mouseDownPosition.x, p.y - mouseDownPosition.y);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.RangePrint: {
                            //表示範囲指定
                            break;
                        }
                        case enmPrintMouseMode.Accessory_Drag: {
                            //飾りの移動
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);

                            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                            let stp=new point();
                            let smode = (vs.ScrData.Accessory_Base == enmBasePosition.Screen);
                            if (smode) {
                                stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width();
                                stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height();
                            } else {
                                stp.x = MapPos.x - MouseDownSRxy.x;
                                stp.y = MapPos.y - MouseDownSRxy.y;
                            }
                            
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            switch (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType) {
                                case Check_Acc_Result.Compass: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let P = attrData.TempData.Accessory_Temp.Push_CompassXY.Clone();
                                    P.offset(stp);     
                                    if(smode)  {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 1, 0, 1));
                                    }
                                    vs.AttMapCompass.Position = P;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    clsAccessory.Compass_print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Title: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let P = attrData.TempData.Accessory_Temp.Push_titleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.MapTitle.Position = P;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    clsAccessory.Title_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Scale: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let P = attrData.TempData.Accessory_Temp.Push_ScaleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    vs.MapScale.Position = P;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    clsAccessory.Scale_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Note: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let P = attrData.TempData.Accessory_Temp.Push_DataNoteXY.Clone();
                                    P.offset(stp);
                                    if(smode)  {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.DataNote.Position = P;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    clsAccessory.Note_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Legend: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let P = attrData.TempData.Accessory_Temp.Push_LegendXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    vs.MapLegend.Base.LegendXY[attrData.TempData.Accessory_Temp.Edit_Legend] = P;
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    clsAccessory.Legend_print(g,  attrData.TempData.Accessory_Temp.Edit_Legend, false);
                                    break;
                                }
                                case Check_Acc_Result.GroupBox: {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.Accessory_Temp.GroupBox_Rect = attrData.TempData.Accessory_Temp.OriginalGroupBoxRect.Clone();
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.Accessory_Temp.GroupBox_Rect.offset(movePx.x,movePx.y);
                                    if (smode) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let atg = attrData.TempData.Accessory_Temp.GroupBox_Rect;
                                        let rcp = atg.centerP();
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        rcp = spatial.checkAndModifyPointInRect(rcp, new rectangle(0, 0, vs.ScrData.frmPrint_FormSize.width(), vs.ScrData.frmPrint_FormSize.height()));
                                        // @ts-expect-error TS(2554): Expected 4 arguments, but got 2.
                                        atg = new rectangle(new point(rcp.x - atg.width() / 2, rcp.y - atg.height() / 2), new size(atg.width(), atg.height()));
                                    }
                                    clsAccessory.AccGroupBoxDraw(g);
                                    break;
                                }
                            }
                            break;
                        }
                        case enmPrintMouseMode.od: {
                            OD_Line_Print(g,MapPos);
                            elem.style.cursor = 'move';
                            break;
                        }
                        case enmPrintMouseMode.Fig: {
                            break;
                        }
                        case enmPrintMouseMode.Normal: {
                            g.clearRect(0, 0, elem.width, elem.height);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            g.putImageData(attrData.TempData.frmPrint_Temp.image, movePx.x, movePx.y);
                            break;
                        }
                    }
                    elem.style.cursor = 'move';
                    mousePreviousPosition = p;
                }
                break;
            }
        }
    }


    function mup(e: any) {
        
        e.preventDefault();
        let event;
        if(mousePointingSituation == mousePointingSituations.pinch){
            pinchUp(e)
            mousePointingSituation = mousePointingSituations.up;
            MouseDownF=false;
            return;
        }
        if ((e.type === "mouseup") ||(e.type === "mouseleave")){
             event = e;
        } else {
             event = e.changedTouches[0];
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle;
        let mouseUpPosition = Generic.getCanvasXY(event);
        let mouseUpSRXT = vs.ScrData.getSRXY(mouseUpPosition);

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if((attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.SymbolPoint )||( attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.LabelPoint )){
        //シンボル位置／ラベル位置移動
            if (e.which  == 3) {
            } else {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let tmp = attrData.TempData.frmPrint_Temp;
                let P = vs.ScrData.getSRXY(mouseDownPosition);

                switch (tmp.PrintMouseMode) {
                    case enmPrintMouseMode.SymbolPoint: {
                        let d = tmp.OnObject[0];
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Symbol = P;
                        break;
                    }
                    case enmPrintMouseMode.LabelPoint: {
                        let d = tmp.OnObject[0];
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Label = P;
                        break;
                    }
                }
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                clsPrint.printMapScreen(Frm_Print.picMap);
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.picMap.style.cursor = 'default';
                mousePointingSituation = mousePointingSituations.up;
                tmp.PrintMouseMode = enmPrintMouseMode.Normal;
                tmp.MouseDownF = false;
                return;
            }
        }

        if (mousePointingSituation == mousePointingSituations.downAndMove) {
            let StartP = vs.ScrData.getSRXY(mouseDownPosition);
            let EndP = mouseUpSRXT;
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            let mapstep = new point(EndP.x - StartP.x, EndP.y - StartP.y);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.RangePrint: {
                    break;
                }
                case enmPrintMouseMode.Accessory_Drag: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType == Check_Acc_Result.GroupBox) {
                        //グループボックスのドラッグの場合
                        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
                        let stp = new point();
                        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {

                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let gr = attrData.TempData.Accessory_Temp;
                            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                            let movePx = new point(gr.GroupBox_Rect.left - gr.OriginalGroupBoxRect.left, gr.GroupBox_Rect.top - gr.OriginalGroupBoxRect.top);
                            stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width();
                            stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height();
                        } else {
                            stp = mapstep;
                        }
                        let ag = vs.AccessoryGroupBox;
                        if (ag.Title == true) {
                            vs.MapTitle.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Scale == true) {
                            vs.MapScale.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Note == true) {
                            vs.DataNote.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Comapss == true) {
                            vs.AttMapCompass.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Legend == true) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            for (let i = 0; i < attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                                vs.MapLegend.Base.LegendXY[i].offset(stp.x, stp.y);
                            }
                        }
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    callback(elem, attrData);
                    break;
                }
                case enmPrintMouseMode.od: {
                    //線モード
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let Layernum = attrData.TotalData.LV1.SelectedLayer;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let odra = attrData.TempData.frmPrint_Temp.OD_Drag;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.LayerData[Layernum].Add_OD_Bezier(odra.ObjectPos, odra.Data, mouseUpSRXT);
                    // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                    clsPrint.printMapScreen(Frm_Print.picMap);
                    break;
                }
                case enmPrintMouseMode.Fig: {
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    vs.ScrData.ScrView.offset(StartP.x - EndP.x, StartP.y - EndP.y);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    callback(elem, attrData);
                    break;
                }
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        }else{
            if (e.type != "mouseleave") {
                //クリックの場合
                let touchTime = (new Date().getTime()- touchStartTime) / 1000;
                let rightButton=false;
                if(e.button==2){rightButton=true;}
                if((e.type === "touchend") && (mousePointingSituation == mousePointingSituations.down)&&(touchTime>0.5)){
                    //タッチで0.5秒以上移動しない場合は右クリック
                    rightButton=true;
                }
                switch (rightButton) {
                    case true: {//右クリック
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                            case enmPrintMouseMode.Normal: {
                                let retV = Check_Acc(mouseUpPosition);
                                if (retV.type == Check_Acc_Result.NoAccessory) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    let av = attrData.TotalData.ViewStyle;
                                    let mnuAccPopupVisible: any = [];
                                    if (av.ScrData.ThreeDMode.Set3D_F == false) {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        attrData.TempData.frmPrint_Temp.LocationMenuString.ClickMapPos = mouseUpSRXT;
                                        Loc_Data_Menu(mnuAccPopupVisible);
                                    }
                                    //非表示の飾りを表示させるメニューの表示
                                    if ((av.MapTitle.Visible == false) || (av.MapLegend.Base.Visible == false) || (av.MapScale.Visible == false) || (
                                        av.AttMapCompass.Visible == false) || (av.AttMapCompass.Visible == false) || (av.AccessoryGroupBox.Visible == false)) {
                                        if (mnuAccPopupVisible.length > 0) {
                                            mnuAccPopupVisible.push({ caption: "-" });
                                        }
                                    }
                                    if (av.MapTitle.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "タイトル表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.MapTitle.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapLegend.Base.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "凡例表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.MapLegend.Base.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapScale.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "スケール表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.MapScale.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AttMapCompass.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "方位表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.AttMapCompass.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap) }
                                        });
                                    }
                                    if (av.DataNote.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "注表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.DataNote.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AccessoryGroupBox.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "飾りグループボックス表示",
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            event: function () { attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    if(attrData.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido){
                                        let pmnu={caption: "この地点のWeb地図を表示", enabled: true, child: [
                                            { caption: "Googleマップ", event: showWebMap },
                                            { caption: "YAHOO!地図", event:  showWebMap},
                                            { caption: "Mapion", event:  showWebMap},
                                            { caption: "MapFan", event:  showWebMap},
                                            { caption: "地理院地図", event:  showWebMap},
                                            { caption: "今昔マップ", event:  showWebMap}
                                        ]};
                                        mnuAccPopupVisible.push(pmnu);
                                        function showWebMap(data: any, e: any) {
                                            let p = vs.ScrData.getSRXY(mouseDownPosition);
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            let xy1=spatial.Get_Reverse_XY(p,attrData.TotalData.ViewStyle.Zahyo);   
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            let xy=spatial.Get_World_IdoKedo(xy1,attrData.TotalData.ViewStyle.Zahyo);   
                                            let url="";
                                            let zm=13;
                                            switch (data.caption) {
                                                case "Googleマップ":
                                                    url="https://www.google.com/maps/search/?api=1&query=" + xy.lat + "," + xy.lon + '&zoom='+zm;
                                                    break;
                                                case "YAHOO!地図":
                                                    url="https://map.yahoo.co.jp/maps?lat=" + xy.lat + "&lon=" + xy.lon + "&z="+zm;
                                                    break;
                                                case "Mapion":
                                                    url="https://www.mapion.co.jp/m2/" + xy.lat + "," + xy.lon + ","+zm;
                                                    break;
                                                case "MapFan":
                                                    url="https://mapfan.com/map/spots/search?c=" + xy.lat + "," + xy.lon + ","+zm;
                                                    break;
                                                case "地理院地図":
                                                    url="https://maps.gsi.go.jp/#"+zm+"/" + xy.lat + "/" + xy.lon;
                                                    break;
                                                case "今昔マップ":
                                                    url="http://ktgis.net/kjmapw/kjmapw.html?lat=" + xy.lat + "&lng=" + xy.lon +"&zoom="+zm;
                                                    break;
                                            }
                                            let x = window.screenX+10;
                                            let y = window.screenY+10;
                                            // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
                                            window.open(url, null, "titlebar=No,status=0,scrollbars=1,resizable=0,width=900,height=700,left="+x+",top="+y);
                                        
                                        }
                                    }
                                    if (mnuAccPopupVisible.length > 0) {
                                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                        Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    }
                                } else {
                                    //飾り上で右クリックメニュー
                                    let mnuAccPopupVisible = [];
                                    switch (retV.type) {
                                        case Check_Acc_Result.Compass:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "方位非表示", event: function () { attrData.TotalData.ViewStyle.AttMapCompass.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "方位設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.GroupBox:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス非表示", event: function () { attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Legend:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "凡例非表示", event: function () { attrData.TotalData.ViewStyle.MapLegend.Base.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "凡例設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Scale:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "スケール非表示", event: function () { attrData.TotalData.ViewStyle.MapScale.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "スケール設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Note:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "注釈非表示", event: function () { attrData.TotalData.ViewStyle.DataNote.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "注釈設定", event: accVisible });
                                            break
                                        case Check_Acc_Result.Title:
                                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                            mnuAccPopupVisible.push({ caption: "タイトル非表示", event: function () { attrData.TotalData.ViewStyle.MapTitle.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "タイトル設定", event: accVisible });
                                            break
                                    }
                                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                    Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    function accVisible(data: any, e: any) {
                                        switch (data.caption) {
                                            case "凡例設定":
                                                frmPrintOption(2);
                                                break;
                                            case "方位設定":
                                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                                frmCompassSettings(attrData.TotalData.ViewStyle.AttMapCompass,
                                                    function (v: any) {
                                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                                        attrData.TotalData.ViewStyle.AttMapCompass = v;
                                                        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                                    });
                                                break;
                                            case "凡例設定":
                                                frmPrintOption(2);
                                                break;
                                            case "スケール設定":
                                                frmPrintOption(4);
                                                break;
                                            default:
                                                frmPrintOption(0);
                                                break;
                                        }
                                    }
                                }
                                break;
                            }
                            case enmPrintMouseMode.od: {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                let ato = attrData.TempData.frmPrint_Temp.OD_Drag;
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                let retV = attrData.LayerData[Layernum].Get_OD_Bezier_RefPoint(ato.ObjectPos, ato.Data);
                                if (retV.ok == true) {
                                    let popmenu = [{ caption: "直線に戻す", event: odReset }];
                                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                    Generic.ceatePopupMenu(popmenu, new point(event.clientX, event.clientY));
                                    function odReset() {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        attrData.LayerData[Layernum].Remove_OD_Bezier(ato.ObjectPos, ato.Data);
                                        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case false: {//左クリック
                        if ((e.type === "touchend") && (mousePointingSituation == mousePointingSituations.down)) {
                            let p = Generic.getCanvasXY(event);
                            LocationSearch(p);
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                                case enmPrintMouseMode.Normal: {
                                    frmPrint.PropertyFix();
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        elem.style.cursor = 'default';
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        mousePointingSituation = mousePointingSituations.up;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
        MouseDownF = false;

        function Loc_Data_Menu(mnuAccPopupVisible: any) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let alm = attrData.TempData.frmPrint_Temp.LocationMenuString;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.TempData.frmPrint_Temp.OnObject.length == 1) {
                        //mnuAccPopupVisible.push({ caption:"図形モードでオブジェクト名・データ値表示", event: function(){}});
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let Layernum = attrData.TempData.frmPrint_Temp.OnObject[0].objLayer;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let ObjNum = attrData.TempData.frmPrint_Temp.OnObject[0].ObjNumber;
                        let dtIndex = alm.DataIndex;
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let al = attrData.LayerData[Layernum];
                        let alo = al.atrObject.atrObjectData[ObjNum];
                        let SymbolPosMeuF = false;
                        switch (al.Print_Mode_Layer) {
                            case enmLayerMode_Number.SoloMode: {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                alm.ObjectNameValue = attrData.getOneObjectPanelLabelString(Layernum, dtIndex, ObjNum, ":");
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                switch (attrData.getSoloMode(Layernum, dtIndex)) {
                                    case enmSoloMode_Number.MarkBlockMode:
                                    case enmSoloMode_Number.MarkSizeMode:
                                    case enmSoloMode_Number.MarkTurnMode:
                                    case enmSoloMode_Number.MarkBarMode:
                                        SymbolPosMeuF = true
                                        break;
                                    case enmSoloMode_Number.ClassHatchMode:
                                    case enmSoloMode_Number.ClassMarkMode:
                                    case enmSoloMode_Number.ClassPaintMode:
                                        if (al.Shape == enmShape.PointShape) {
                                            SymbolPosMeuF = true;
                                        }
                                        break;
                                }

                                break;
                            }
                            case enmLayerMode_Number.GraphMode: {
                                let DataItem = al.LayerModeViewSettings.GraphMode.DataSet[dtIndex].Data;
                                let n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    tx += attrData.Get_DataTitle(Layernum, DataItem[i].DataNumber, false) + ":" +
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        attrData.Get_Data_Value(Layernum, DataItem[i].DataNumber, ObjNum, "") + attrData.Get_DataUnit(Layernum, DataItem[i].DataNumber)
                                    if (i != n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                SymbolPosMeuF = true;
                                break;
                            }
                            case enmLayerMode_Number.LabelMode: {
                                let DataItem = al.LayerModeViewSettings.LabelMode.DataSet[dtIndex].DataItem;
                                let n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    tx += attrData.Get_DataTitle(Layernum, DataItem[i], false) + ":" +
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        attrData.Get_Data_Value(Layernum, DataItem[i], ObjNum, "") + attrData.Get_DataUnit(Layernum, DataItem[i]);
                                    if (i != n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                break;
                            }
                            case enmLayerMode_Number.TripMode:
                                break;
                        }
                        if (SymbolPosMeuF == true) {
                            mnuAccPopupVisible.push({
                                caption: "記号表示位置移動", event: function () {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    if (attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage == true) {
                                        if (window.confirm("新しい記号表示位置をクリックして指定します(右クリックでキャンセル)。") == false) {return;}
                                    }
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage = false;
                                    // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.SymbolPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Symbol) == false) {
                                mnuAccPopupVisible.push({
                                    caption: "記号表示位置を元に戻す", event: function () {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let on = attrData.TempData.frmPrint_Temp.OnObject[0];
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let d = attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Symbol = d.CenterPoint;
                                        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if ((al.Print_Mode_Layer == enmLayerMode_Number.LabelMode) || ((al.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.getSoloMode(Layernum, dtIndex) == enmSoloMode_Number.StringMode))) {
                            mnuAccPopupVisible.push({
                                caption: "ラベル表示位置移動", event: function () {
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    if (attrData.TempData.frmPrint_Temp.LabelPointFirstMessage == true) {
                                        if (window.confirm("新しいラベル表示位置をクリックして指定します(右クリックでキャンセル)。") == false) { return; }
                                    }
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.frmPrint_Temp.LabelPointFirstMessage = false;
                                    // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                    attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.LabelPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Label) == false) {
                                mnuAccPopupVisible.push({
                                    caption: "ラベル表示位置を元に戻す", event: function () {
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let on = attrData.TempData.frmPrint_Temp.OnObject[0];
                                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                        let d = attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Label = d.CenterPoint;
                                        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if (alo.HyperLinkNum > 0) {
                            mnuAccPopupVisible.push({ caption: "-" })
                        }
                        for (let i = 0; i < alo.HyperLinkNum; i++) {
                            mnuAccPopupVisible.push({caption:"リンク：" + alo.HyperLink[i].Name,event:function(data: any,e: any){
                                window.open(data.tag, '_blank');
                            },tag:alo.HyperLink[i].Address} );
                        }
                        // mnuAccPopupVisible.push({ caption: "-" });
                        // mnuAccPopupVisible.push({caption: "リンクの編集", event: mnuAccPopupVisible_LinkEdit} );

                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let ObjName = Generic.Check_StringLength_And_Cut(attrData.Get_KenObjName(Layernum, ObjNum), 20)
                        if (alo.Objectstructure == enmKenCodeObjectstructure.SyntheticObj) {
                            // mnuAccPopupVisible.push({caption: ObjName + "の構成", event: mnuAccPopupVisible_synthetic} );
                        }
                    }
                    break;
                }
            }
            if (alm.ContourStacPos != -1) {
                mnuAccPopupVisible.push({caption: "等値線の値表示", event: function(){}});
            }
        }
    }

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
    let pinchCenter=new point();
    let pinchBaseDis: any;
    let pinchPresentDis: any;
    function pinch(event: any){
        let touches=event.changedTouches;
        let p1=Generic.getCanvasXY(touches[0]);
        let p2=Generic.getCanvasXY(touches[1]);
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
        pinchBaseDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
    }
    function pinchMove(event: any){
        let touches=event.changedTouches;
        if(touches.length>1){
            let p1=Generic.getCanvasXY(touches[0]);
            let p2=Generic.getCanvasXY(touches[1]);
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
            pinchPresentDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
        }
    }
    function pinchUp(event: any){
        let ratio=pinchPresentDis/pinchBaseDis;
        expansionMap(pinchCenter,ratio);
    }
    function onWheel(event: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if ((MouseDownF == true)||(attrData.TempData.drawing==true)) {
            return;
        }
        let bairitu = 0.5;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        if ((window.event.ctrlKey == true) && (window.event.shiftKey == true)) {
            bairitu = 0.125;
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        } else if (window.event.shiftKey == true) {
            bairitu = bairitu * 0.25;
        }

        let ratio;
        if (event.deltaY > 0) {
            ratio = 1 - bairitu;
        } else {
            ratio = 1 + bairitu * 2;
        }
        let cpos = Generic.getCanvasXY(event);
        expansionMap(cpos,ratio);
    }

    function expansionMap(cpos: any,ratio: any){
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let sd = attrData.TotalData.ViewStyle.ScrData;
        let sv = sd.ScrView;
        let Pos = sd.getSRXY(cpos);
        let h1 = Pos.y - sv.top;
        let h2 = sv.bottom - Pos.y;
        let w1 = Pos.x - sv.left;
        let w2 = sv.right - Pos.x;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let rec = new rectangle(Pos.x - w1 / ratio, Pos.x + w2 / ratio, Pos.y - h1 / ratio, Pos.y + h2 / ratio);
        if (Generic.Check_New_ScrView(sd.MapRectangle, rec) == true) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.ViewStyle.ScrData.ScrView = rec;
            callback(elem);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.Fig: {
                    //frm_Figure.Print_Fig()
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    frmPrint.PrintCursorObjectLine(g,true);
                    break;
                }
                case enmPrintMouseMode.MultiObjectSelect: {
                    //printSeletedMultiObject()
                    break;
                }
            }
        }

    }


    /**ドラッグで移動中のOD曲線を描く */
    function OD_Line_Print(g: any,P: any){

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let DataNum = attrData.TempData.frmPrint_Temp.OD_Drag.Data;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ObNum = attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Layernum = attrData.TotalData.LV1.SelectedLayer
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let al = attrData.LayerData[Layernum];
        let odmd = al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let oal = attrData.LayerData[odmd.o_Layer];
        let OriginP;

        let origin_objn = oal.atrObject.ObjectNum
        if (odmd.O_object > origin_objn) {
            //ダミーオブジェクトが始点の場合
            let Dob = oal.Dummy[odmd.O_object - origin_objn].code;
            OriginP = al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
        } else {
            OriginP = oal.atrObject.atrObjectData[odmd.O_object].CenterPoint;
        }
        let DestP = al.atrObject.atrObjectData[ObNum].CenterPoint;
        let poxy = Generic.Get_OD_Spline_Point(P, OriginP, DestP);

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let pxy = clsSpline.Spline_Get(0, 4, poxy, 0.1, attrData.TotalData.ViewStyle.ScrData);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let Cate  = attrData.Get_Categoly(Layernum, DataNum, ObNum);
        let O_LPat  = al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.Clone();
        O_LPat.Color=clsBase.ColorRed();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.Draw_Line(g, O_LPat,  pxy);
    }

    /**線モードのラインの移動チェック */
    function LocationODSearch(ScreenP: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MapP = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        let odc = Near_OD(MapP);
        if (odc != -1) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let tx4 = "OD" + attrData.Get_KenObjName(attrData.TotalData.LV1.SelectedLayer, odc);
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.label3.style.left=(Frm_Print.label1.offsetWidth+Frm_Print.label2.offsetWidth+20).px();
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.label3.innerHTML = tx4;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.od;
            return true;
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
            return false;
        }
    }

    /**線モードの最寄りラインを求める */
    function Near_OD(MapP: any){
        let Near_ODNumber  = -1;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let al = attrData.LayerData[Layernum];
                let DataNum = al.atrData.SelectedIndex;
                if (al.Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if ((attrData.getSoloMode(Layernum, DataNum) == enmSoloMode_Number.ClassODMode) && (
                        al.Shape != enmShape.LineShape) && (al.Type != enmLayerType.Trip)) {
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let ovl = attrData.TotalData.TotalMode.OverLay.DataSet[attrData.TotalData.TotalMode.OverLay.SelectedIndex];
                for (let i = 0; i < ovl.DataItem.length; i++) {
                    let Layernum = ovl.Layer
                    let DataNum = ovl.DataNumber
                    if ((ovl.Print_Mode_Layer == enmLayerMode_Number.SoloMode)&& (ovl.Mode == enmSoloMode_Number.ClassODMode) && (
                        // @ts-expect-error TS(2304): Cannot find name 'al'.
                        al.Shape != enmShape.LineShape)){
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                        if (Near_ODNumber != -1) {
                            break;
                        }
                    }
                }
                break;
            }
        }
        return Near_ODNumber;

        function Near_OD_sub(MapP: any ,  Layernum: any ,  DataNum: any){
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let al=attrData.LayerData[Layernum];
            let mod=al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let oal=attrData.LayerData[mod.o_Layer];
            let StartP ;
            let EndP ;
            let objn  = al.atrObject.ObjectNum;
            let origin_objn  = oal.atrObject.ObjectNum
            if(mod.O_object > origin_objn ){
                //ダミーオブジェクトが始点の場合
                let Dob  = oal.Dummy[mod.O_object - origin_objn].code;
                StartP=al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
            }else{
                StartP = oal.atrObject.atrObjectData[mod.O_object].CenterPoint;
            }

            let mind  = 5;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let Category_Array = attrData.Get_CategolyArray(Layernum, DataNum);
            let Near_Obj  = -1;
            for (let i = 0; i <  objn ; i++) {
                EndP = al.atrObject.atrObjectData[i].CenterPoint;
                let Cate  = Category_Array[i];
                if(Cate != -1 ){
                    let D ;
                    if (((i == mod.O_object) && (Layernum == mod.o_Layer)) || (
                        (al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.BlankF == false) && (
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.Check_Missing_Value(Layernum, DataNum, i) == false))) {
                        let retV = al.Get_OD_Bezier_RefPoint(i, DataNum);
                        if (retV.ok == false) {
                             D= spatial.Distance_PointLine2(MapP, StartP, EndP).distance;
                        } else {
                            let ControlP = retV.RefPoint;
                            let Refp = Generic.Get_OD_Spline_Point(ControlP, StartP, EndP);
                            let d1 = spatial.Distance_PointLine2(MapP, StartP, Refp[2]).distance;
                            let d2 = spatial.Distance_PointLine2(MapP, Refp[1], Refp[2]).distance;
                            let d3 = spatial.Distance_PointLine2(MapP, EndP, Refp[1]).distance;
                            // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
                            D = Math.min(d1, d2);
                            // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
                            D = Math.min(D, d3);
                        }
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        D *= attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        if (D < mind) {
                            // @ts-expect-error TS(2322): Type 'number | undefined' is not assignable to typ... Remove this comment to see the full error message
                            mind = D;
                            Near_Obj = i;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos = Near_Obj;
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.frmPrint_Temp.OD_Drag.Data = DataNum;
                        }
                    }
                }
            }
            return Near_Obj;
        }
    }

    /**等値線の位置とカーソルチェック */
    function LocationContourSearch(ScreenP: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MapP = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        let tx4 = ""
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = -1;
            if (Check_Contour_in() == true) {
                let c = Near_Contour(MapP);
                if (c != -1) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = c;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let cdt = attrData.TempData.ContourMode_Temp.Contour_Object[c];
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    tx4 = "等値線" + cdt.Value.toString() + attrData.Get_DataUnit(cdt.Layernum, cdt.DataNum);
                    let conDiv=document.getElementById("contourDataTip");
                    if(conDiv==undefined){
                        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                        conDiv=Generic.createNewSpan(Frm_Print,tx4,"contourDataTip","",ScreenP.x+5,ScreenP.y+scrMargin.top-15,"z-index:2000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#ffffff",undefined)
                    }else{
                        conDiv.innerHTML=tx4;
                        conDiv.style.left=(ScreenP.x+5).px();
                        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
                        conDiv.style.top=(ScreenP.y+scrMargin.top-15).px();
                    }
                }
            }
        }
        if(tx4==""){
            let dv=document.getElementById("contourDataTip")
            if( dv!=undefined){
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.removeChild(dv);
            }
    }

        // 等値線モードが表示されているかチェック
         function Check_Contour_in() {    
             // @ts-expect-error TS(2304): Cannot find name 'attrData'.
             switch (attrData.TotalData.LV1.Print_Mode_Total) {
                 case enmTotalMode_Number.DataViewMode: {
                     // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                     let Layernum = attrData.TotalData.LV1.SelectedLayer;
                     // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                     if (attrData.LayerData[Layernum].atrData.Count > 0) {
                         // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                         let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                         // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                         if (attrData.getSoloMode(Layernum, DataNum) == enmSoloMode_Number.ContourMode) {
                             return true;
                         }
                     }
                     break;
                 }
                 case enmTotalMode_Number.OverLayMode: {
                     // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                     let ato = attrData.TotalData.TotalMode.OverLay;
                     let atod = ato.DataSet[ato.SelectedIndex];
                     for (let i = 0; i < atod.DataItem.Count; i++) {
                         let atodi = atod.DataItem[i];
                         if ((atodi.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (atodi.Mode == enmSoloMode_Number.ContourMode)) {
                             return true;
                         }
                     }
                     break;
                 }
            }
            return false;
        }
        // 最寄りの等値線取得
        function Near_Contour(MapP: any) {
            let Near_ContourNumber = -1;
            let mind = 5;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let atc = attrData.TempData.ContourMode_Temp;
            for (let i = 0; i < atc.Contour_All_Number; i++) {
                let atco = atc.Contour_Object[i];
                if ((atco.Flag == true) && (spatial.Check_PointInBox(MapP, 0, atco.Circumscribed_Rectangle) == true)) {
                    for (let j = atco.PointStac; j <= atco.PointStac + atco.NumOfPoint - 2; j++) {
                        let retV = spatial.Distance_PointLine(MapP.x,MapP.y, atc.Contour_Point[j].x,atc.Contour_Point[j].y, atc.Contour_Point[j + 1].x, atc.Contour_Point[j + 1].y ) ;
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        let d=retV.distance* attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                        if (d < mind) {
                            mind = d;
                            Near_ContourNumber = i;
                        }
                    }
                }
            }
            return Near_ContourNumber;
        }
    }

    /**マウス位置の情報、カーソルを＋に変える場合trueを返す*/
    function LocationSearch(ScreenP: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MapP  = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        picMapMouseMovePointInformation(ScreenP);
        let L_Print_Mode_Total ;
        let L_Layer ;
        let L_Print_Mode_Layer ;
        let L_Data ;
        let L_Solomode ;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if( attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.SeriesMode ){
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let koma  = attrData.TempData.Series_temp.Koma;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let n  = attrData.TotalData.TotalMode.Series.SelectedIndex;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let im= attrData.TotalData.TotalMode.Series.DataSet[n].DataItem[koma];
                L_Print_Mode_Total = im.Print_Mode_Total;
                L_Print_Mode_Layer = im.Print_Mode_Layer;
                L_Layer = im.Layer;
                L_Data = im.Data;
                L_Solomode = im.SoloMode;
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let lv = attrData.TotalData.LV1;
            L_Print_Mode_Total = lv.Print_Mode_Total
            L_Layer = lv.SelectedLayer;
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let ld = attrData.LayerData[L_Layer];
            L_Print_Mode_Layer = ld.Print_Mode_Layer;
            L_Data = ld.atrData.SelectedIndex;
            switch (L_Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    switch (L_Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode: {
                            L_Data = ld.atrData.SelectedIndex;
                            L_Solomode = ld.atrData.Data[L_Data].ModeData;
                            break;
                        }
                        case enmLayerMode_Number.GraphMode: {
                            L_Data = ld.LayerModeViewSettings.GraphMode.SelectedIndex;
                            break;
                        }
                        case enmLayerMode_Number.LabelMode: {
                            L_Data = ld.LayerModeViewSettings.LabelMode.SelectedIndex;
                            break;
                        }
                        case enmLayerMode_Number.TripMode: {
                            L_Data = ld.LayerModeViewSettings.TripMode.SelectedIndex;
                            break;
                        }
                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    L_Data = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                    break;
                }
            }
        }
        switch (L_Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                //データ表示モード
                let OnObject = [];
                let Layernum = L_Layer;
                let dtindex = L_Data;
                switch (L_Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        if (OnObject.length == 0) {
                            //frm_PropertypnlProperty.Visible = false;
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'mnuPropertyWindow'.
                            if (mnuPropertyWindow.Checked == true) {
                                //frm_Property.ShowTripModeProperty(attrData, Layernum, OnObject, dtindex);
                            }
                        }
                        break;
                    }
                }
                if (L_Print_Mode_Layer != enmLayerMode_Number.TripMode) {
                    switch (OnObject.length) {
                        case 0: {
                            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                            propertyWindow.pnlProperty.setVisibility(false);
                            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                            Frm_Print.label2.innerHTML="";
                            break;
                        }
                        case 1: {
                            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                            if ((propertyWindow.getVisibility() == true) && (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal)) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                frmPrint.ShowOneObjectProperty( Layernum, OnObject[0].ObjNumber, dtindex, attrData.LayerData[Layernum].Print_Mode_Layer);
                            }
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            attrData.TempData.frmPrint_Temp.LocationMenuString.DataIndex = dtindex;
                            break;
                        }
                        default: {
                            frmPrint.ShowOverLayObjectProperty(Layernum,dtindex,  OnObject);
                            break;
                        }
                    }
                }
                let tx = "";
                for (let i = 0; i < OnObject.length; i++) {
                    let onum = OnObject[i].ObjNumber;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    tx += attrData.Get_KenObjName(Layernum, onum) + "［" + attrData.Get_Data_Value(Layernum, L_Data, onum, "欠損値") + "］"
                    if (i != OnObject.length - 1) {
                        tx += "／"
                    }
                }
                if (tx != "") {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.MultiObjectswitch) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        if (attrData.TempData.frmPrint_Temp.MultiObjects.IndexOf(OnObject[0].ObjNumber) != -1) {
                            tx += "（選択中）"
                        }
                    }
                }
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
                // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
                Frm_Print.label2.innerHTML= tx;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.frmPrint_Temp.OnObject = OnObject;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                if ((attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.MultiObjectswitch) && (L_Print_Mode_Layer == enmLayerMode_Number.SoloMode)){
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                //重ね合わせモード
                Get_Object_By_XY_OverLayMode(MapP, L_Data);
                break;
            }
        }

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
    }

    /**重ね合わせモードの位置情報 */
    function Get_Object_By_XY_OverLayMode(MapP: any, OverLayIndex: any) {
        let tx = "";
        let f = false;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.frmPrint_Temp.OnObject = [];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ato = attrData.TotalData.TotalMode.OverLay;
        let lblTxt = ""
        for (let i = ato.DataSet[OverLayIndex].DataItem.length - 1; i >= 0; i--) {
            let d = ato.DataSet[OverLayIndex].DataItem[i];
            let OnObject = NearestObject(MapP, d.Layer);
            for (let j = 0; j < OnObject.length; j++) {
                let ObjData = OnObject[j];
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                lblTxt += "レイヤ：" + attrData.Get_LayerName(ObjData.objLayer) + '<br>';
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                lblTxt += "オブジェクト：" + attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber) + '<br>';
                if (f == true) {
                    tx += "／";
                } else {
                    f = true;
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                tx += attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber);
                switch (d.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode:
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        lblTxt += "　" + attrData.getOneObjectPanelLabelString(ObjData.objLayer, d.DataNumber, ObjData.ObjNumber,"<br>　") + '<br>';
                        break;
                    case enmLayerMode_Number.GraphMode:
                        lblTxt += "　グラフ表示モード" + '<br>';
                        break;
                    case enmLayerMode_Number.LabelMode:
                        lblTxt += "　ラベル表示モード" + '<br>';
                        break;
                    case enmLayerMode_Number.TripMode:
                        // lblTxt += "　移動表示モード" + '<br>';
                        break;
                }
                lblTxt += '<br>';
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.frmPrint_Temp.OnObject.push(ObjData);
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        if (propertyWindow.getVisibility() == true) {
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            let cnode = propertyWindow.pnlProperty.childNodes;
            for (let i in cnode) {
                if (cnode[i].name == "grid") {
                    // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                    propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.pnlProperty.setVisibility(true);
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.pnlProperty.objInfo.style.height = '100%';
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.pnlProperty.objInfo.innerHTML = lblTxt;
            // if (lblTxt == "") {
            //     frm_Property.pnlOverLayProperty.Visible = false;
            // }
        }
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.label2.innerHTML = tx
    }

    /**一番近いオブジェクトを探して数とオブジェクト番号を返す */
    function NearestObject(MapP: any, Layernum: any) {
        let OnObject = [];

        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        if (attrData.LayerData[Layernum].Type == enmLayerType.Trip) {

        } else {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            switch (attrData.LayerData[Layernum].Shape) {
                case (enmShape.PolygonShape): {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetRectIn(MapP.x, MapP.y);
                    if (retV.number > 0) {
                        for (let i = 0; i < retV.number; i++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] == true) {
                                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                                if (attrData.Check_Point_in_Kencode_OneObject(Layernum, retV.Tags[i], MapP) == true) {
                                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                    let ObjData =new strLocationSearchObject(Layernum,retV.Tags[i]) ;
                                    OnObject.push(ObjData);
                                }
                            }
                        }
                    }
                    break;
                }
                default: {
                    let retV;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let mind = 10 / attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.LayerData[Layernum].Shape == enmShape.PointShape) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetNearPointNumber(MapP.x, MapP.y, mind);
                    } else {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetNearestLineNumber(MapP.x, MapP.y, mind);
                    }
                    if (retV.num > 0) {
                        let serarchNCount = 0;
                        for (let i = 0; i < retV.num; i++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            if (attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] == true) {
                                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                let ObjData = new strLocationSearchObject(Layernum, retV.Tags[i]);
                                OnObject.push(ObjData);
                                serarchNCount++;
                                if (serarchNCount == 5) {//候補は最大で5つ
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        return OnObject;
    }

    //地図上をカーソルが移動した場合に座標情報を表示
    function picMapMouseMovePointInformation(MousePosition: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        const vs = attrData.TotalData.ViewStyle;
        let originalP = vs.ScrData.getSRXY(MousePosition);
        if(spatial.Check_PsitionReverse_Enable(originalP, vs.Zahyo)==true){
            let P  = spatial.Get_Reverse_XY(originalP, vs.Zahyo);
            let PSt  = Generic.Get_PositionCoordinate_Strings(P, vs.Zahyo);
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.label1.innerHTML=PSt.x + "/" + PSt.y;
        }else{
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.label1.innerHTML="";
        }
    }

    function Check_Acc(ScreenP: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let vs = attrData.TotalData.ViewStyle;
        let threed = vs.ScrData.ThreeDMode;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ata = attrData.TempData.Accessory_Temp;
        if (vs.MapTitle.Visible == true) {
            if (spatial.Check_PointInBox(ScreenP, vs.MapTitle.Font.Kakudo, ata.MapTitle_Rect) == true) {
                ata.Push_titleXY = vs.MapTitle.Position.Clone();
                return { type: Check_Acc_Result.Title, rect: ata.MapTitle_Rect };
            }
        }
        //------方位
        if ((vs.AttMapCompass.Visible == true) && ((vs.ScrData.ThreeDMode.Set3D_F == false) || ((threed.Pitch == 0) && (threed.Head == 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapCompass_Rect) == true) {
                ata.Push_CompassXY = vs.AttMapCompass.Position.Clone();
                return { type: Check_Acc_Result.Compass, rect: ata.MapCompass_Rect };
            }
        }
        //------スケール
        if ((vs.MapScale.Visible == true) && ((vs.ScrData.ThreeDMode.Set3D_F == false) || ((threed.Pitch == 0) && (threed.Head == 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapScale_Rect) == true) {
                ata.Push_ScaleXY = vs.MapScale.Position.Clone();
                return { type: Check_Acc_Result.Scale, rect: ata.MapScale_Rect };
            }
        }
        //------注
        if (vs.DataNote.Visible == true) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.DataNote_Rect) == true) {
                ata.Push_DataNoteXY = vs.DataNote.Position.Clone();
                return { type: Check_Acc_Result.Note, rect: ata.DataNote_Rect };
            }
        }
        //------凡例
        for (let i = ata.Legend_No_Max - 1; i >= 0; i--) {
            let lg =  ata.MapLegend_W[i];
            if ((vs.MapLegend.Base.Visible == true) || (lg.LineKind_Flag == true) || (lg.PointObject_Flag == true)) {
                if (spatial.Check_PointInBox(ScreenP, 0, lg.Rect) == true) {
                    ata.Edit_Legend = i;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    ata.Push_LegendXY = attrData.TotalData.ViewStyle.MapLegend.Base.LegendXY[i];
                    return { type: Check_Acc_Result.Legend, rect: lg.Rect };
                }
            }
        }
        //------グループボックス
        if ((vs.AccessoryGroupBox.Visible == true) && (vs.ScrData.ThreeDMode.Set3D_F == false)) {
            let Acc_Rect = ata.GroupBox_Rect.Clone();
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let pad = attrData.Get_PaddingPixcel(vs.AccessoryGroupBox.Back);
            Acc_Rect.inflate(pad, pad);
            if (spatial.Check_PointInBox(ScreenP, 0, Acc_Rect) == true) {
                ata.Push_GroupBoxXY = vs.MapScale.Position.Clone();
                ata.OriginalGroupBoxRect = Acc_Rect.Clone();
                return { type: Check_Acc_Result.GroupBox, rect: Acc_Rect };
            }
        }
        return { type: Check_Acc_Result.NoAccessory, rect: undefined };
    }
}

class frmPrint {

    /** コピー画像ウインドウ表示*/
    static copyImageWindow(){
        frmPrint.savePNG(true)
    }

    //画像ファイルに保存
    /**
 * Description placeholder
 *
 * @static
 * @param {boolean} [WindowOutFlag=false] 
 */
static savePNG(WindowOutFlag = false) {
        let tilecanvas = document.createElement("canvas");
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        tilecanvas.width = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width();
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        tilecanvas.height = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height();
        // @ts-expect-error TS(2339): Property 'vivility' does not exist on type 'CSSSty... Remove this comment to see the full error message
        tilecanvas.style.vivility = false;
        let tg = tilecanvas.getContext('2d');
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        tg.fillStyle = "#ffffff";//背後が透過色になるため白にする
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        tg.fillRect(0, 0, tilecanvas.width, tilecanvas.height)
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        tg.drawImage(Frm_Print.picMap, 0, 0);
        if (WindowOutFlag == true) {
            Generic.windowCenterOpen(tilecanvas.toDataURL(), tilecanvas.width, tilecanvas.height, "MANDARA JS");
        } else {
            Generic.prompt(undefined, "画像ファイル名", "mandara.png", function (v: any) {
                let a = document.createElement('a');
                a.href = tilecanvas.toDataURL();
                a.download = v;
                a.click();
                });
        }
    }

    //線種ラインパターン設定
    /**
 * Description placeholder
 *
 * @static
 * @param {*} data 
 * @param {*} e 
 */
static linePattern(data: any,e: any) {
        const backDiv = Generic.set_backDiv("", "線種ラインパターン設定", 240, 380, true, true, buttonOK, 0.2, true);
        Generic.Set_Box_Position_in_Browser(e, backDiv);

        Generic.createNewSpan(backDiv, "地図ファイル", "", "", 15, 35, "", "");
        let NewLineKind: any = [];
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MapFileList = attrData.GetMapFileName()
        let list = [];
        for (let i = 0; i < MapFileList.length; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            let LK = attrData.SetMapFile(MapFileList[i]).Get_TotalLineKind();
            NewLineKind.push(LK);
            list.push({ value: MapFileList[i], text: MapFileList[i] });
        }
        const selectDataItem = Generic.createNewSelect(backDiv, list, 0, "", 15, 55, false, mapListchange, "width:210px;");
        const pnlLinePattern = Generic.createNewDiv(backDiv, "", "", "", 15, 85, 210, 200, "overflow-y:scroll;overflow-x:hidden;border:solid 1px;border-color:#666666;", "");
        const pnlLineList = Generic.createNewDiv(pnlLinePattern, "", "", "", 0, 0, 210, 100, "", "");
        let meshf=false;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        for (let i = 0; i < attrData.TotalData.LV1.Lay_Maxn; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            if (attrData.LayerData[i].Type == enmLayerType.Mesh) {
                meshf= true;
                break;
            }
        }
        const pnlMeshLine = Generic.createNewDiv(backDiv, "", "", "", 15, 290, 200, 40, "", "");
        const picMeshLine=Generic.createNewWordDivCanvas(pnlMeshLine, "","メッシュデータの輪郭ラインパターン",0,0,100,meshLinePatternClick);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let MeshLpat=attrData.TotalData.ViewStyle.MeshLine.Clone();
        if (meshf == true) {
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            pnlMeshLine.setVisibility(true);
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.Draw_Sample_LineBox(picMeshLine,MeshLpat );
            // @ts-expect-error TS(2339): Property 'px' does not exist on type 'number'.
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop - pnlLinePattern.offsetTop - 5).px();
        } else {
            // @ts-expect-error TS(2339): Property 'setVisibility' does not exist on type 'H... Remove this comment to see the full error message
            pnlMeshLine.setVisibility(false);
            // @ts-expect-error TS(2339): Property 'px' does not exist on type 'number'.
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop + pnlMeshLine.offsetHeight - pnlLinePattern.offsetTop).px();
        }
        showLinePattern();

        function meshLinePatternClick(e: any) {
            clsLinePatternSet(e, MeshLpat, LinePatternGet);
            function LinePatternGet(Lpat: any) {
                MeshLpat = Lpat;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            }
        }
        function mapListchange() {
            showLinePattern();
        }
        function buttonOK() {
            for (let i = 0; i < MapFileList.length; i++) {
                let lk = [];
                for (let j in NewLineKind[i]) {
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    let d = new LPatSek_Info();
                    d.Pat = NewLineKind[i][j].Pat.Clone();
                    lk.push(d);
                }
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.SetMapFile(MapFileList[i]).Set_TotalLineKind(lk);
            }
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            attrData.TotalData.ViewStyle.MeshLine = MeshLpat.Clone();
            Generic.clear_backDiv();
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            clsPrint.printMapScreen(Frm_Print.picMap);
        }

        function showLinePattern(){
            const LineKindHeight=35;
            while (pnlLineList.lastChild) {
                pnlLineList.removeChild(pnlLineList.lastChild);
            }
            let Mpindex  = selectDataItem.selectedIndex
            let lnum  = NewLineKind[Mpindex].length;
            // @ts-expect-error TS(2339): Property 'px' does not exist on type 'number'.
            pnlLineList.style.height = (lnum * LineKindHeight + 10).px();

            for(let i  = 0 ;i< lnum;i++){
                let lk=NewLineKind[Mpindex][i];
                let y=i * LineKindHeight + 3;
                let lc=Generic.createNewWordDivCanvas(pnlLineList, "",lk.Name,10,y,100,inePatternClick);
                // @ts-expect-error TS(2339): Property 'tag' does not exist on type 'HTMLCanvasE... Remove this comment to see the full error message
                lc.tag=i;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Draw_Sample_LineBox(lc, lk.Pat);
            }
            function inePatternClick(e: any){
                let n=e.target.tag;
                clsLinePatternSet(e, NewLineKind[Mpindex][n].Pat, LinePatternGet);
                function LinePatternGet(Lpat: any) {
                    NewLineKind[Mpindex][n].Pat = Lpat;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                }
            }
        }
}

    /**
 * Description placeholder
 *
 * @static
 */
static windowClose(){
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.nextVisible=(propertyWindow.getVisibility()==true);
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.setVisibility(false);
        frmPrint.propertyWindowClose();
    }

    /**
 * Description placeholder
 *
 * @static
 */
static propertyWindowClose(){
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.fixed=false;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.pnlProperty.setVisibility(false);
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.style.borderWidth='1px';    

    }

    //プロパティウインドウの表をコピー
    /**
 * Description placeholder
 *
 * @static
 */
static copyProperty(){
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        let toptx=propertyWindow.pnlProperty.objInfo.innerText+'\n'+'\n';
        let gridtx="";
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        let cnode = propertyWindow.pnlProperty.childNodes;
        for(let i in cnode){
            if(cnode[i].name=="grid"){
                gridtx=Generic.getTableValue(cnode[i].table);
                break;
            }
        }
        Generic.copyText(toptx+gridtx);
    }

    //プロパティウインドウの固定・解除
    /**
 * Description placeholder
 *
 * @static
 */
static PropertyFix() {
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        if (propertyWindow.pnlProperty.getVisibility() == true) {
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            let f = !propertyWindow.fixed;
            if (f == true) {
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.style.borderWidth = '2px';
            } else {
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.style.borderWidth = '1px';
            }
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.fixed = f;
        }
    }

    //複数オブジェクトのプロパティ表示
    /**
 * Description placeholder
 *
 * @static
 * @param {*} Layernum 
 * @param {*} dtindex 
 * @param {*} OnObject 
 */
static ShowOverLayObjectProperty(Layernum: any,dtindex: any,OnObject: any ){
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        if ((propertyWindow.pnlProperty.getVisibility()==true) && (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal)) {
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            let cnode = propertyWindow.pnlProperty.childNodes;
            for(let i in cnode){
                if(cnode[i].name=="grid"){
                    // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                    propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.pnlProperty.setVisibility(true);
        let ptx = "";
        for (let i = 0; i < OnObject.length; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            ptx += attrData.Get_KenObjName(Layernum, OnObject[i].ObjNumber) + '<br>' +
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Get_DataTitle(Layernum, dtindex, false) + ":" +
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Get_Data_Value(Layernum, dtindex, OnObject[i].ObjNumber, attrData.TotalData.ViewStyle.Missing_Data.Label) +
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.Get_DataUnit_With_Kakko(Layernum, dtindex);
            if (i != OnObject.length - 1) {
                ptx += '<br>' + '<br>';
            }
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.pnlProperty.objInfo.style.height = '100%';
            // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
            propertyWindow.pnlProperty.objInfo.innerHTML = ptx;
        }
    }

    //1オブジェクトのプロパティ表示
    /**
 * Description placeholder
 *
 * @static
 * @param {*} LayerNum 
 * @param {*} objNumber 
 * @param {*} DataNumber 
 * @param {*} LayerMode 
 */
static ShowOneObjectProperty(LayerNum: any ,  objNumber: any ,  DataNumber: any , LayerMode: any ){
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        if ((propertyWindow.oObject == objNumber) && (propertyWindow.oLayer == LayerNum) && (propertyWindow.oData == DataNumber) && (propertyWindow.pnlProperty.getVisibility() == true)) {
            return;
        }
        let headTx="";
        let headHeight;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.pnlProperty.setVisibility(true);

        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        let cnode = propertyWindow.pnlProperty.childNodes;
        for (let i in cnode) {
            if (cnode[i].name == "grid") {
                // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
                propertyWindow.pnlProperty.removeChild(cnode[i]);
                break;
            }
        }
        let data=[];
        switch (LayerMode) {
            case enmLayerMode_Number.SoloMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                headTx+=attrData.getOneObjectPanelLabelString(LayerNum, DataNumber, objNumber, '<br>' + " ");
                headHeight=90;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let n = attrData.Get_DataNum(LayerNum);
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                data = Generic.Array2Dimension(3, n + 1);
                data[0][0] = "データ項目";
                data[1][0] = "値";
                data[2][0] = "単位";
                for (let i = 0; i < n; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[0][i + 1] = attrData.Get_DataTitle(LayerNum, i, true);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[1][i + 1] = attrData.Get_Data_Value(LayerNum, i, objNumber, "");
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[2][i + 1] = attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
            case enmLayerMode_Number.GraphMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let al=attrData.LayerData[LayerNum];
                let Dset  = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                let ald=al.LayerModeViewSettings.GraphMode.DataSet[Dset];
                let DataItem = ald.Data;
                let n = DataItem.length;
                if (n == 0) {
                    return;
                }
                switch (ald.GraphMode) {
                    case enmGraphMode.PieGraph:
                    case enmGraphMode.StackedBarGraph: {
                        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                        data = Generic.Array2Dimension(3, n + 2);
                        data[0][0] = "データ項目";
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        data[1][0] = "値(" + attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        data[2][0] = "割合(%)";
                        let sum = 0;
                        let v = [];
                        for (let i = 0; i < n; i++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let val = Number(attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
                            data[1][i + 1] = val;
                            v.push(val);
                            sum += val;
                        }
                        v.push(sum);
                        data[0][n + 1] = "合計";
                        data[1][n + 1] =  sum;
                        ;
                        for (let i = 0; i <= n; i++) {
                            data[2][i + 1] = (v[i] / sum * 100).toFixed(2);
                        }
                        break;
                    }
                    case enmGraphMode.LineGraph:
                    case enmGraphMode.BarGraph: {
                        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                        data = Generic.Array2Dimension(2, n + 5);
                        data[0][0] = "データ項目";
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        data[1][0] = "値(" + attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        let sum = 0;
                        let v = [];
                        for (let i = 0; i < n; i++) {
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                            let val =Number( attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
                            data[1][i + 1] = val;
                            v.push(val);
                            sum += val;
                        }
                        v.sort(function (a, b) { return a - b; });
                        data[0][n + 1] = "合計";
                        data[0][n + 2] = "平均値";
                        data[0][n + 3] = "最大値";
                        data[0][n + 4] = "最小値";
                        data[1][n + 1] = sum;
                        data[1][n + 2] = (sum / n).toFixed(4);
                        data[1][n + 3] = v[n - 1];
                        data[1][n + 4] = v[0];
                        break;
                    }
                }
                break;
            }
            case enmLayerMode_Number.LabelMode: {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                let al=attrData.LayerData[LayerNum];
                let Dset  = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                let ald=al.LayerModeViewSettings.LabelMode.DataSet[Dset];
                let DataItem = ald.DataItem;
                let n = DataItem.length;
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                data = Generic.Array2Dimension(3, n + 1);
                data[0][0] = "データ項目";
                data[1][0] = "値";
                data[2][0] = "単位";
                for (let i = 0; i < n; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i], true);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[1][i + 1] =  attrData.Get_Data_Value(LayerNum, DataItem[i], objNumber, "");
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    data[2][i + 1] = attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.pnlProperty.objInfo.innerHTML = headTx;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.pnlProperty.objInfo.style.height = headHeight.px();
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.oObject = objNumber;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.oLayer = LayerNum;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.oData = DataNumber;

        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        let y=propertyWindow.pnlProperty.objInfo.offsetHeight;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        let gd=Generic.createNewGrid(propertyWindow.pnlProperty, "", "", "", "", data, 0, y, '100%', propertyWindow.pnlProperty.offsetHeight - 70,'100%', "", "font-size:13px", 1, "background-color:#aaffaa;",  "", "", "");
        // @ts-expect-error TS(2339): Property 'name' does not exist on type 'HTMLDivEle... Remove this comment to see the full error message
        gd.name="grid";
}

    /**
 * Description placeholder
 *
 * @static
 */
static set_frmPrint_Window_Size() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let FpicRect  = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize;
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.style.left = (FpicRect.left - scrMargin.side).px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.style.top = (FpicRect.top - scrMargin.top).px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.style.width =(FpicRect.width() + scrMargin.side*2).px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.style.height = (FpicRect.height() + scrMargin.top + scrMargin.bottom).px();
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.style.left=(Frm_Print.style.left.removePx()+Frm_Print.style.width.removePx()+10).px();
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.style.top=(Frm_Print.style.top.removePx()+scrMargin.top).px();
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        propertyWindow.style.height=Frm_Print.style.height;
        // @ts-expect-error TS(2304): Cannot find name 'propertyWindow'.
        Generic.moveInnerElement(propertyWindow);
        this.resizeMapWindow();
    }
    
    /**
 * Description placeholder
 *
 * @static
 */
static resizeMapWindow() {
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        var mapDIV = Frm_Print.picMap.parentNode;
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.picMap.style.left = scrMargin.side.px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.picMap.style.top = scrMargin.top.px();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.picMap.width = mapDIV.style.width.removePx() - scrMargin.side * 2;
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.picMap.height = mapDIV.style.height.removePx() - scrMargin.top - scrMargin.bottom;
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let p = new point(Frm_Print.style.left.removePx() + scrMargin.side, Frm_Print.style.top.removePx() + scrMargin.top);
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let s = new size(Frm_Print.picMap.width, Frm_Print.picMap.height);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Generic.moveInnerElement(Frm_Print);
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        if(Frm_Print.maxSizeFlag==false){
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            Frm_Print.oldpos=new rectangle(new point(Frm_Print.style.left.removePx(),Frm_Print.style.top.removePx()),
                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                        new size(Frm_Print.style.width.removePx(),Frm_Print.style.height.removePx()));
        }
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.resetMaxButton(!Frm_Print.maxSizeFlag);
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        if (Frm_Print.getVisibility() == true) {
            // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
            clsPrint.printMapScreen(Frm_Print.picMap, attrData);
        }
    }
    /**
 * Description placeholder
 *
 * @static
 */
static Init_FrmPrint() {
        let ScreenH = Generic.getBrowserHeight();
        let ScreenW = Generic.getBrowserWidth();
    
        let a = ScreenH * 0.7;
        if (ScreenH > ScreenW) {
            a = ScreenW * 0.7;
        }
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let psw = a + scrMargin.side * 2;
        // @ts-expect-error TS(2304): Cannot find name 'scrMargin'.
        let psh = a / 1.41 + scrMargin.top + scrMargin.bottom;
    
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let p = new point(ScreenW / 2 - psw / 2, ScreenH / 2 - psh / 2);
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        let s = new size(psw, psh);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.resetMaxButton(true);
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.label1.innerHTML="";
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.label2.innerHTML="";
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        Frm_Print.label3.innerHTML="";
    }
    

    /**連続表示ボタン 次*/
    static seriesNext() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ats = attrData.TotalData.TotalMode.Series;
        let n = ats.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atst = attrData.TempData.Series_temp;
        atst.Koma = (atst.Koma == ats.DataSet[n].DataItem.length - 1) ? 0 : atst.Koma+1;
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    /**連続表示ボタン 前*/
    static seriesBefore() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let ats = attrData.TotalData.TotalMode.Series;
        let n = ats.SelectedIndex;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let atst = attrData.TempData.Series_temp;
        atst.Koma  = (atst.Koma == 0) ? ats.DataSet[n].DataItem.length - 1 : atst.Koma-1;
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //全体表示ボタン
    /**
 * Description placeholder
 *
 * @static
 */
static wholeMapShow() {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TotalData.ViewStyle.ScrData.ScrView = attrData.TotalData.ViewStyle.ScrData.MapRectangle.Clone();
        // @ts-expect-error TS(2304): Cannot find name 'Frm_Print'.
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //カーソル位置のオブジェクトを強調
    /**
 * Description placeholder
 *
 * @static
 * @param {*} g 
 * @param {*} Draw_F 
 */
static PrintCursorObjectLine(g: any, Draw_F: any) {
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let OnObject = attrData.TempData.frmPrint_Temp.OnObject;
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        let OldObject = attrData.TempData.frmPrint_Temp.OldObject;
        if (OnObject.length == 0) {
            if (OldObject.length > 0) {
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
                // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                attrData.TempData.frmPrint_Temp.OldObject = [];
            }
            return;
        } else {
            if ((OnObject.length == OldObject.length) && (Draw_F == false)) {
                //ちらつき防止のため、描画済みの場合は再描画しない
                let f = false;
                for (let i in OnObject) {
                    for (let j in OldObject) {
                        if ((OnObject[i].ObjNumber != OldObject[j].ObjNumber) || (OnObject[i].objLayer != OldObject[j].objLayer)) {
                            f = true;
                            break;
                        }
                    }
                }
                if (f == false) {
                    return;
                }
            }
        }
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
        attrData.TempData.frmPrint_Temp.OldObject = Generic.ArrayClone(OnObject);
        for (let i in OnObject) {
            printSelectedObject(g, OnObject[i].objLayer, OnObject[i].ObjNumber);
        }

        function printSelectedObject(g: any, Layernum: any, ObjNum: any) {
            // @ts-expect-error TS(2304): Cannot find name 'attrData'.
            const sp = attrData.LayerData[Layernum].Shape;
            switch (sp) {
                case enmShape.PointShape: {
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let CP = attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Symbol;
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                    let Mk = clsBase.Mark();
                    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                    Mk.Tile.Color = new colorRGBA([255, 0, 150, 150]);
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    attrData.Draw_Mark(g, OP, 10, Mk)
                    break;
                }
                case enmShape.LineShape:
                case enmShape.PolygonShape: {

                    let w = 3;
                    if (sp == enmShape.LineShape) {
                        w = 5;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                    if (attrData.LayerData[Layernum].Type == enmLayerType.Mesh) {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let meshP = Generic.ArrayClone(attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MeshPoint);
                        meshP[4] = meshP[0].Clone();
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let pxy = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(5, meshP, false);
                        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                        drawLines(g, pxy, 3, new colorRGBA([255, 0, 150, 200]));
                    } else {
                        // @ts-expect-error TS(2304): Cannot find name 'attrData'.
                        let ELine = attrData.Get_Enable_KenCode_MPLine(Layernum, ObjNum);
                        for (let j in ELine) {
                            let pxy = clsPrint.Get_PointXY_by_LineCode(Layernum, ELine[j].LineCode, false);
                            if (pxy != undefined) {
                                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                                drawLines(g, pxy, w, new colorRGBA([255, 0, 150, 150]));
                            }
                        }
                    }
                    break;
                }
            }
            function drawLines(g: any, pxy: any, w: any, col: any) {
                g.lineWidth = w;
                g.strokeStyle = col.toRGBA();
                g.beginPath();
                g.moveTo(pxy[0].x, pxy[0].y);
                pxy.forEach(function (p: any) {
                    g.lineTo(p.x, p.y);
                });
                g.stroke();
            }
        }
    }
}


