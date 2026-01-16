import { appState } from './core/AppState';
import { clsAccessory } from './clsAccessory';
import { clsSpline } from './clsDraw';
import type { JsonValue } from './types';

// mousePointingSituations は globals.d.ts で定義済み

// enmPrintMouseMode は globals.d.ts で定義済み

// Check_Acc_Result は globals.d.ts で定義済み

function mapMouseInternal(elem: HTMLCanvasElement, callback: (element: HTMLCanvasElement, attrData?: IAttrData) => void): void {
    const state = appState();

    let MouseDownF: boolean = false;
    let mousePointingSituation: number = mousePointingSituations.up;
    let mouseDownPosition: point;
    let mousePreviousPosition: point;
    let touchStartTime: number;
    
    elem.addEventListener("mousedown", mdown, false);
    elem.addEventListener("touchstart", mdown, {passive:false});
    elem.addEventListener("mousemove", mmove, false);
    elem.addEventListener("touchmove", mmove, {passive:false});
    elem.addEventListener("mouseup", mup, false);
    elem.addEventListener("touchend", mup as EventListener);
    elem.addEventListener("mouseleave", mup, false);
    
    const mousewheelevent: string = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    elem.addEventListener(mousewheelevent, onWheel as EventListener, false);
    const g: CanvasRenderingContext2D = elem.getContext('2d')!;

    //出力画面でのキー操作
    document.addEventListener('keydown', function (e: KeyboardEvent): void {
        const elm: NodeListOf<HTMLElement> = document.getElementsByName("backDiv");
        if (elm.length === 0) {
            if (Frm_Print.style.zIndex === "2") {
                if (typeof Frm_Print.getVisibility === "function" && Frm_Print.getVisibility() === true) {
                    keyOperation(e.keyCode, e.shiftKey, e.ctrlKey);
                }
            }
        }
    });
    
    document.addEventListener('keyup', function (e: KeyboardEvent): void {
        const elm: NodeListOf<HTMLElement> = document.getElementsByName("backDiv");
        if (elm.length === 0) {
            if (e.keyCode === 13) {
                if (state.settingModeWindow.style.zIndex === "2") {
                    //設定画面でEnterを押すと描画開始ボタンにフォーカス移動
                    (document.getElementById("btnDraw") as HTMLElement).focus();
                }
            }
        }
    });

    function keyOperation(keyCode: number, shiftKey: boolean, ctrlKey: boolean): void {
        const state = appState();
        if (mousePointingSituation !== mousePointingSituations.up) {
            return;
        }
        const vs = state.attrData.TotalData.ViewStyle.ScrData.ScrView;
        const w: number = vs.width();
        const h: number = vs.height();
        switch (keyCode) {
            case 82: //Rキー
                state.frmPrint.wholeMapShow();
                break;
            case 37:
            case 38:
            case 39:
            case 40: {
                let xmove: number = 0;
                let ymove: number = 0;
                if ((keyCode === 37) || (keyCode === 39)) {
                    xmove = (keyCode - 38) * w / 5;
                }
                if ((keyCode === 38) || (keyCode === 40)) {
                    ymove = (keyCode - 39) * h / 5;
                }
                if ((shiftKey === true) && (ctrlKey === true)) {
                    xmove /= 8;
                    ymove /= 8;
                } else {
                    if (shiftKey === true) {
                        xmove /= 2;
                        ymove /= 2;
                    }
                    if (ctrlKey === true) {
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
                let bairitsu: number;

                if (keyCode === 34) {
                    bairitsu = 0.4;
                } else {
                    bairitsu = -0.4;
                }
                if ((shiftKey === true) && (ctrlKey === true)) {
                    bairitsu /= 8;
                } else {
                    if (shiftKey === true) {
                        bairitsu /= 2;
                    }
                    if (ctrlKey === true) {
                        bairitsu /= 4;
                    }
                }
                const ratio = 1 - bairitsu;
                expansionMap(state.attrData.TotalData.ViewStyle.ScrData.getSXSY_Margin().centerP(), ratio);             
                break;
            }
        }
    }

    function mdown(e: MouseEvent | TouchEvent) {
        const state = appState();
        e.preventDefault();
        let event;
        if (e.type === "mousedown") {
             event = e as MouseEvent;
        } else {
             event = (e as TouchEvent).changedTouches[0];
        }
        MouseDownF = true;
        touchStartTime=new Date().getTime();
        mousePointingSituation = mousePointingSituations.down;
        mouseDownPosition = Generic.getCanvasXY(event);

    }


    function mmove(e: MouseEvent | TouchEvent) {
        const state = appState();
        let event;
        e.preventDefault();
        if (e.type === "mousemove") {
             event = e as MouseEvent;
        } else {
            if(mousePointingSituation === mousePointingSituations.pinch){
                pinchMove(e as TouchEvent);
                return;
            }
            if( (e as TouchEvent).changedTouches.length>1){
                e.preventDefault();
                mousePointingSituation = mousePointingSituations.pinch;
                pinch(e as TouchEvent);
                return;
            }else{
                event = (e as TouchEvent).changedTouches[0];
            }
        }
        const p = Generic.getCanvasXY(event);
        const vs = state.attrData.TotalData.ViewStyle;
        const MapPos = vs.ScrData.getSRXY(p);
        switch (mousePointingSituation) {
            case mousePointingSituations.up: {
                //ボタンを押さずに移動中
                switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                    case enmPrintMouseMode.od:
                    case enmPrintMouseMode.Normal: {
                        let mCursorF = false;
                        if (state.attrData.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F === false) {
                            if (state.propertyWindow.fixed === false) {
                                LocationSearch(p);
                            } else {
                                //picMapMouseMovePointInformation(p);
                            }
                            LocationContourSearch(p);
                            mCursorF = LocationODSearch(p);
                        }
                        if (mCursorF === false) {
                            if (Check_Acc(p).type !== Check_Acc_Result.NoAccessory) {
                                mCursorF = true;
                            }
                        }
                        if (mCursorF === true) {
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
                if (p.Equals(mouseDownPosition) === false) {
                    mousePreviousPosition = p;
                    mousePointingSituation = mousePointingSituations.downAndMove;
                    switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.Normal: {
                            const retv = Check_Acc(p);
                            state.attrData.TempData.frmPrint_Temp.mouseAccesoryDragType = retv.type;
                            if (state.attrData.TempData.frmPrint_Temp.mouseAccesoryDragType !== Check_Acc_Result.NoAccessory) {
                                state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Accessory_Drag;
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
                if (p.Equals(mousePreviousPosition) === false) {
                    const vs = state.attrData.TotalData.ViewStyle;
                    const MouseDownSRxy = vs.ScrData.getSRXY(mouseDownPosition);
                    const movePx = new point(p.x - mouseDownPosition.x, p.y - mouseDownPosition.y);
                    switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.RangePrint: {
                            //表示範囲指定
                            break;
                        }
                        case enmPrintMouseMode.Accessory_Drag: {
                            //飾りの移動
                            g.putImageData(state.attrData.TempData.frmPrint_Temp.image, 0, 0);

                            const stp=new point(0, 0);
                            const smode = (vs.ScrData.Accessory_Base === enmBasePosition.Screen);
                            if (smode) {
                                stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width;
                                stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height;
                            } else {
                                stp.x = MapPos.x - MouseDownSRxy.x;
                                stp.y = MapPos.y - MouseDownSRxy.y;
                            }
                            
                            switch (state.attrData.TempData.frmPrint_Temp.mouseAccesoryDragType) {
                                case Check_Acc_Result.Compass: {
                                    let P = state.attrData.TempData.Accessory_Temp.Push_CompassXY.Clone();
                                    P.offset(stp);     
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 1, 0, 1));
                                    }
                                    vs.AttMapCompass.Position = P;
                                    clsAccessory.Compass_print(g);
                                    break;
                                }
                                case Check_Acc_Result.Title: {
                                    let P = state.attrData.TempData.Accessory_Temp.Push_titleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.MapTitle.Position = P;
                                    clsAccessory.Title_Print(g);
                                    break;
                                }
                                case Check_Acc_Result.Scale: {
                                    let P = state.attrData.TempData.Accessory_Temp.Push_ScaleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    vs.MapScale.Position = P;
                                    clsAccessory.Scale_Print(g);
                                    break;
                                }
                                case Check_Acc_Result.Note: {
                                    let P = state.attrData.TempData.Accessory_Temp.Push_DataNoteXY.Clone();
                                    P.offset(stp);
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.DataNote.Position = P;
                                    clsAccessory.Note_Print(g);
                                    break;
                                }
                                case Check_Acc_Result.Legend: {
                                    let P = state.attrData.TempData.Accessory_Temp.Push_LegendXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    vs.MapLegend.Base.LegendXY[state.attrData.TempData.Accessory_Temp.Edit_Legend] = P;
                                    clsAccessory.Legend_print(g,  state.attrData.TempData.Accessory_Temp.Edit_Legend, false);
                                    break;
                                }
                                case Check_Acc_Result.GroupBox: {
                                    state.attrData.TempData.Accessory_Temp.GroupBox_Rect = state.attrData.TempData.Accessory_Temp.OriginalGroupBoxRect.Clone();
                                    state.attrData.TempData.Accessory_Temp.GroupBox_Rect.offset(movePx.x,movePx.y);
                                    if (smode) {
                                        let atg = state.attrData.TempData.Accessory_Temp.GroupBox_Rect;
                                        let rcp = atg.centerP();
                                        rcp = spatial.checkAndModifyPointInRect(rcp, new rectangle(0, 0, vs.ScrData.frmPrint_FormSize.width(), vs.ScrData.frmPrint_FormSize.height()));
                                        atg = new rectangle(rcp.x - atg.width() / 2, rcp.y - atg.height() / 2, atg.width(), atg.height());
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
                            g.putImageData(state.attrData.TempData.frmPrint_Temp.image, movePx.x, movePx.y);
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


    function mup(e: MouseEvent | TouchEvent) {
        const state = appState();
        
        e.preventDefault();
        let event;
        if(mousePointingSituation === mousePointingSituations.pinch){
            pinchUp(e as TouchEvent)
            mousePointingSituation = mousePointingSituations.up;
            MouseDownF=false;
            return;
        }
        if ((e.type === "mouseup") ||(e.type === "mouseleave")){
             event = e as MouseEvent;
        } else {
             event = (e as TouchEvent).changedTouches[0];
        }
        const vs = state.attrData.TotalData.ViewStyle;
        const mouseUpPosition = Generic.getCanvasXY(event);
        const mouseUpSRXT = vs.ScrData.getSRXY(mouseUpPosition);

        if((state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.SymbolPoint )||( state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.LabelPoint )){
        //シンボル位置／ラベル位置移動
            if (e.which  === 3) {
            } else {
                const tmp = state.attrData.TempData;
                const P = vs.ScrData.getSRXY(mouseDownPosition);

                switch (tmp.PrintMouseMode) {
                    case enmPrintMouseMode.SymbolPoint: {
                        const d = tmp.OnObject[0];
                        state.attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Symbol = P;
                        break;
                    }
                    case enmPrintMouseMode.LabelPoint: {
                        const d = tmp.OnObject[0];
                        state.attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Label = P;
                        break;
                    }
                }
                clsPrint.printMapScreen(Frm_Print.picMap);
                Frm_Print.picMap.style.cursor = 'default';
                mousePointingSituation = mousePointingSituations.up;
                tmp.PrintMouseMode = enmPrintMouseMode.Normal;
                tmp.MouseDownF = false;
                return;
            }
        }

        if (mousePointingSituation === mousePointingSituations.downAndMove) {
            const StartP = vs.ScrData.getSRXY(mouseDownPosition);
            const EndP = mouseUpSRXT;
            const mapstep = new point(EndP.x - StartP.x, EndP.y - StartP.y);
            switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.RangePrint: {
                    break;
                }
                case enmPrintMouseMode.Accessory_Drag: {
                    if (state.attrData.TempData.frmPrint_Temp.mouseAccesoryDragType === Check_Acc_Result.GroupBox) {
                        //グループボックスのドラッグの場合
                        let stp = new point(0, 0);
                        if (vs.ScrData.Accessory_Base === enmBasePosition.Screen) {

                            const gr = state.attrData.TempData.Accessory_Temp;
                            const movePx = new point(gr.GroupBox_Rect.left - gr.OriginalGroupBoxRect.left, gr.GroupBox_Rect.top - gr.OriginalGroupBoxRect.top);
                            stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width;
                            stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height;
                        } else {
                            stp = mapstep;
                        }
                        const ag = vs.AccessoryGroupBox as any;
                        if (ag.Title === true) {
                            vs.MapTitle.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Scale === true) {
                            vs.MapScale.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Note === true) {
                            vs.DataNote.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Comapss === true) {
                            vs.AttMapCompass.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Legend === true) {
                            for (let i = 0; i < state.attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                                vs.MapLegend.Base.LegendXY[i].offset(stp.x, stp.y);
                            }
                        }
                    }
                    callback(elem, state.attrData);
                    break;
                }
                case enmPrintMouseMode.od: {
                    //線モード
                    const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                    const odra = state.attrData.TempData.frmPrint_Temp.OD_Drag;
                    state.attrData.LayerData[Layernum].Add_OD_Bezier(odra.ObjectPos, odra.Data, mouseUpSRXT);
                    clsPrint.printMapScreen(Frm_Print.picMap);
                    break;
                }
                case enmPrintMouseMode.Fig: {
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    vs.ScrData.ScrView.offset(StartP.x - EndP.x, StartP.y - EndP.y);
                    callback(elem, state.attrData);
                    break;
                }
            }
            state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        }else{
            if (e.type !== "mouseleave") {
                //クリックの場合
                const touchTime = (new Date().getTime()- touchStartTime) / 1000;
                let rightButton=false;
                if((e as MouseEvent).button===2){rightButton=true;}
                if((e.type === "touchend") && (mousePointingSituation === mousePointingSituations.down)&&(touchTime>0.5)){
                    //タッチで0.5秒以上移動しない場合は右クリック
                    rightButton=true;
                }
                switch (rightButton) {
                    case true: {//右クリック
                        switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                            case enmPrintMouseMode.Normal: {
                                const retV = Check_Acc(mouseUpPosition);
                                if (retV.type === Check_Acc_Result.NoAccessory) {
                                    const av = state.attrData.TotalData.ViewStyle;
                                    const mnuAccPopupVisible: MenuItem[] = [];
                                    if (av.ScrData.ThreeDMode.Set3D_F === false) {
                                        state.attrData.TempData.frmPrint_Temp.LocationMenuString.ClickMapPos = mouseUpSRXT;
                                        Loc_Data_Menu(mnuAccPopupVisible);
                                    }
                                    //非表示の飾りを表示させるメニューの表示
                                    if ((av.MapTitle.Visible === false) || (av.MapLegend.Base.Visible === false) || (av.MapScale.Visible === false) || (
                                        av.AttMapCompass.Visible === false) || (av.DataNote.Visible === false) || (av.AccessoryGroupBox?.Visible === false)) {
                                        if (mnuAccPopupVisible.length > 0) {
                                            mnuAccPopupVisible.push({ caption: "-" });
                                        }
                                    }
                                    if (av.MapTitle.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "タイトル表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.MapTitle.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapLegend.Base.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "凡例表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.MapLegend.Base.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapScale.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "スケール表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.MapScale.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AttMapCompass.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "方位表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.AttMapCompass.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap) }
                                        });
                                    }
                                    if (av.DataNote.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "注表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.DataNote.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AccessoryGroupBox.Visible === false) {
                                        mnuAccPopupVisible.push({
                                            caption: "飾りグループボックス表示",
                                            event: function () { state.attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if(state.attrData.TotalData.ViewStyle.Zahyo.Mode === enmZahyo_mode_info.Zahyo_Ido_Keido){
                                        const pmnu: MenuItem = {caption: "この地点のWeb地図を表示", enabled: true, child: [
                                            { caption: "Googleマップ", event: showWebMap } as MenuItem,
                                            { caption: "YAHOO!地図", event:  showWebMap} as MenuItem,
                                            { caption: "Mapion", event:  showWebMap} as MenuItem,
                                            { caption: "MapFan", event:  showWebMap} as MenuItem,
                                            { caption: "地理院地図", event:  showWebMap} as MenuItem,
                                            { caption: "今昔マップ", event:  showWebMap} as MenuItem
                                        ]};
                                        mnuAccPopupVisible.push(pmnu);
                                        function showWebMap(data: MenuItem, e?: Event) {
                                            const state = appState();
                                            const p = vs.ScrData.getSRXY(mouseDownPosition);
                                            const xy1=spatial.Get_Reverse_XY(p,state.attrData.TotalData.ViewStyle.Zahyo);   
                                            const xy=spatial.Get_World_IdoKedo(xy1,state.attrData.TotalData.ViewStyle.Zahyo);   
                                            let url="";
                                            const zm=13;
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
                                            const x = window.screenX+10;
                                            const y = window.screenY+10;
                                            window.open(url, "_blank", "titlebar=No,status=0,scrollbars=1,resizable=0,width=900,height=700,left="+x+",top="+y);
                                        
                                        }
                                    }
                                    if (mnuAccPopupVisible.length > 0) {
                                        Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    }
                                } else {
                                    //飾り上で右クリックメニュー
                                    const mnuAccPopupVisible: MenuItem[] = [];
                                    switch (retV.type) {
                                        case Check_Acc_Result.Compass:
                                            mnuAccPopupVisible.push({ caption: "方位非表示", event: function () { state.attrData.TotalData.ViewStyle.AttMapCompass.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "方位設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.GroupBox:
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス非表示", event: function () { state.attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Legend:
                                            mnuAccPopupVisible.push({ caption: "凡例非表示", event: function () { state.attrData.TotalData.ViewStyle.MapLegend.Base.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "凡例設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Scale:
                                            mnuAccPopupVisible.push({ caption: "スケール非表示", event: function () { state.attrData.TotalData.ViewStyle.MapScale.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "スケール設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Note:
                                            mnuAccPopupVisible.push({ caption: "注釈非表示", event: function () { state.attrData.TotalData.ViewStyle.DataNote.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "注釈設定", event: accVisible });
                                            break
                                        case Check_Acc_Result.Title:
                                            mnuAccPopupVisible.push({ caption: "タイトル非表示", event: function () { state.attrData.TotalData.ViewStyle.MapTitle.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "タイトル設定", event: accVisible });
                                            break
                                    }
                                    Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    function accVisible(data: {caption: string}, e: Event) {
                                        const state = appState();
                                        switch (data.caption) {
                                            case "凡例設定":
                                                frmPrintOption(2);
                                                break;
                                            case "方位設定":
                                                frmCompassSettings(state.attrData.TotalData.ViewStyle.AttMapCompass,
                                                    function (v: MapCompass) {
                                                        state.attrData.TotalData.ViewStyle.AttMapCompass = v;
                                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                                    });
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
                                const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                                const ato = state.attrData.TempData.frmPrint_Temp.OD_Drag;
                                const retV = state.attrData.LayerData[Layernum].Get_OD_Bezier_RefPoint(ato.ObjectPos, ato.Data);
                                if (retV.ok === true) {
                                    const popmenu = [{ caption: "直線に戻す", event: odReset }];
                                    Generic.ceatePopupMenu(popmenu, new point(event.clientX, event.clientY));
                                    function odReset() {
                                        const state = appState();
                                        state.attrData.LayerData[Layernum].Remove_OD_Bezier(ato.ObjectPos, ato.Data);
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case false: {//左クリック
                        if ((e.type === "touchend") && (mousePointingSituation === mousePointingSituations.down)) {
                            const p = Generic.getCanvasXY(event);
                            LocationSearch(p);
                        } else {
                            switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                                case enmPrintMouseMode.Normal: {
                                    state.frmPrint.PropertyFix();
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
        state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        mousePointingSituation = mousePointingSituations.up;
        switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                state.frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
        MouseDownF = false;

        function Loc_Data_Menu(mnuAccPopupVisible: MenuItem[]) {
            const state = appState();
            const alm = state.attrData.TempData.frmPrint_Temp.LocationMenuString;
            switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    if (state.attrData.TempData.frmPrint_Temp.OnObject.length === 1) {
                        //mnuAccPopupVisible.push({ caption:"図形モードでオブジェクト名・データ値表示", event: function(){}});
                        const Layernum = state.attrData.TempData.frmPrint_Temp.OnObject[0].objLayer;
                        const ObjNum = state.attrData.TempData.frmPrint_Temp.OnObject[0].ObjNumber;
                        const dtIndex = alm.DataIndex;
                        const al = state.attrData.LayerData[Layernum];
                        const alo = al.atrObject.atrObjectData[ObjNum];
                        let SymbolPosMeuF = false;
                        switch (al.Print_Mode_Layer) {
                            case enmLayerMode_Number.SoloMode: {
                                alm.ObjectNameValue = state.attrData.getOneObjectPanelLabelString(Layernum, dtIndex, ObjNum, ":");
                                switch (state.attrData.getSoloMode(Layernum, dtIndex)) {
                                    case enmSoloMode_Number.MarkBlockMode:
                                    case enmSoloMode_Number.MarkSizeMode:
                                    case enmSoloMode_Number.MarkTurnMode:
                                    case enmSoloMode_Number.MarkBarMode:
                                        SymbolPosMeuF = true
                                        break;
                                    case enmSoloMode_Number.ClassHatchMode:
                                    case enmSoloMode_Number.ClassMarkMode:
                                    case enmSoloMode_Number.ClassPaintMode:
                                        if (al.Shape === enmShape.PointShape) {
                                            SymbolPosMeuF = true;
                                        }
                                        break;
                                }

                                break;
                            }
                            case enmLayerMode_Number.GraphMode: {
                                const DataItem = al.LayerModeViewSettings.GraphMode.DataSet[dtIndex].Data;
                                const n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    tx += state.attrData.Get_DataTitle(Layernum, DataItem[i].DataNumber, false) + ":" +
                                        state.attrData.Get_Data_Value(Layernum, DataItem[i].DataNumber, ObjNum, "") + state.attrData.Get_DataUnit(Layernum, DataItem[i].DataNumber)
                                    if (i !== n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                SymbolPosMeuF = true;
                                break;
                            }
                            case enmLayerMode_Number.LabelMode: {
                                const DataItem = al.LayerModeViewSettings.LabelMode.DataSet[dtIndex].DataItem;
                                const n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    tx += state.attrData.Get_DataTitle(Layernum, DataItem[i], false) + ":" +
                                        state.attrData.Get_Data_Value(Layernum, DataItem[i], ObjNum, "") + state.attrData.Get_DataUnit(Layernum, DataItem[i]);
                                    if (i !== n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                break;
                            }
                            case enmLayerMode_Number.TripMode:
                                break;
                        }
                        if (SymbolPosMeuF === true) {
                            mnuAccPopupVisible.push({
                                caption: "記号表示位置移動", event: function () {
                                    if (state.attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage === true) {
                                        if (window.confirm("新しい記号表示位置をクリックして指定します(右クリックでキャンセル)。") === false) {return;}
                                    }
                                    state.attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage = false;
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.SymbolPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Symbol) === false) {
                                mnuAccPopupVisible.push({
                                    caption: "記号表示位置を元に戻す", event: function () {
                                        const on = state.attrData.TempData.frmPrint_Temp.OnObject[0];
                                        const d = state.attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Symbol = d.CenterPoint;
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if ((al.Print_Mode_Layer === enmLayerMode_Number.LabelMode) || ((al.Print_Mode_Layer === enmLayerMode_Number.SoloMode) && (
                            state.attrData.getSoloMode(Layernum, dtIndex) === enmSoloMode_Number.StringMode))) {
                            mnuAccPopupVisible.push({
                                caption: "ラベル表示位置移動", event: function () {
                                    if (state.attrData.TempData.frmPrint_Temp.LabelPointFirstMessage === true) {
                                        if (window.confirm("新しいラベル表示位置をクリックして指定します(右クリックでキャンセル)。") === false) { return; }
                                    }
                                    state.attrData.TempData.frmPrint_Temp.LabelPointFirstMessage = false;
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.LabelPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Label) === false) {
                                mnuAccPopupVisible.push({
                                    caption: "ラベル表示位置を元に戻す", event: function () {
                                        const on = state.attrData.TempData.frmPrint_Temp.OnObject[0];
                                        const d = state.attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Label = d.CenterPoint;
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if (alo.HyperLinkNum > 0) {
                            mnuAccPopupVisible.push({ caption: "-" })
                        }
                        for (let i = 0; i < alo.HyperLinkNum; i++) {
                            mnuAccPopupVisible.push({caption:"リンク：" + alo.HyperLink[i].Name,event:function(data: MenuItem, e: Event){
                                if (data.tag) window.open(data.tag, '_blank');
                            },tag:alo.HyperLink[i].Address} );
                        }
                        // mnuAccPopupVisible.push({ caption: "-" });
                        // mnuAccPopupVisible.push({caption: "リンクの編集", event: mnuAccPopupVisible_LinkEdit} );

                        const ObjName = Generic.Check_StringLength_And_Cut(state.attrData.Get_KenObjName(Layernum, ObjNum), 20)
                        if (alo.Objectstructure === enmKenCodeObjectstructure.SyntheticObj) {
                            // mnuAccPopupVisible.push({caption: ObjName + "の構成", event: mnuAccPopupVisible_synthetic} );
                        }
                    }
                    break;
                }
            }
            if (alm.ContourStacPos !== -1) {
                mnuAccPopupVisible.push({caption: "等値線の値表示", event: function(){}});
            }
        }
    }

    let pinchCenter=new point();
    let pinchBaseDis: number;
    let pinchPresentDis: number;
    function pinch(event: TouchEvent){
        const state = appState();
        const touches=event.changedTouches;
        const p1=Generic.getCanvasXY(touches[0]);
        const p2=Generic.getCanvasXY(touches[1]);
        pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
        pinchBaseDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
    }
    function pinchMove(event: TouchEvent){
        const state = appState();
        const touches=event.changedTouches;
        if(touches.length>1){
            const p1=Generic.getCanvasXY(touches[0]);
            const p2=Generic.getCanvasXY(touches[1]);
            pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
            pinchPresentDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
        }
    }
    function pinchUp(event: TouchEvent){
        const state = appState();
        const ratio=pinchPresentDis/pinchBaseDis;
        expansionMap(pinchCenter,ratio);
    }
    function onWheel(event: WheelEvent) {
        const state = appState();
        if ((MouseDownF === true)||(state.attrData.TempData.drawing===true)) {
            return;
        }
        let bairitu = 0.5;
        if (event.ctrlKey === true && event.shiftKey === true) {
            bairitu = 0.125;
        } else if (event.shiftKey === true) {
            bairitu = bairitu * 0.25;
        }

        let ratio;
        if (event.deltaY > 0) {
            ratio = 1 - bairitu;
        } else {
            ratio = 1 + bairitu * 2;
        }
        const cpos = Generic.getCanvasXY(event);
        expansionMap(cpos,ratio);
    }

    function expansionMap(cpos: point, ratio: number){
        const state = appState();
        const sd = state.attrData.TotalData.ViewStyle.ScrData;
        const sv = sd.ScrView;
        const Pos = sd.getSRXY(cpos);
        const h1 = Pos.y - sv.top;
        const h2 = sv.bottom - Pos.y;
        const w1 = Pos.x - sv.left;
        const w2 = sv.right - Pos.x;
        const rec = new rectangle(Pos.x - w1 / ratio, Pos.x + w2 / ratio, Pos.y - h1 / ratio, Pos.y + h2 / ratio);
        if (Generic.Check_New_ScrView(sd.MapRectangle, rec) === true) {
            state.attrData.TotalData.ViewStyle.ScrData.ScrView = rec;
            callback(elem);
            switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.Fig: {
                    //frm_Figure.Print_Fig()
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    state.frmPrint.PrintCursorObjectLine(g,true);
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
    function OD_Line_Print(g: CanvasRenderingContext2D, P: point){
        const state = appState();

        const DataNum = state.attrData.TempData.frmPrint_Temp.OD_Drag.Data;
        const ObNum = state.attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos;
        const Layernum = state.attrData.TotalData.LV1.SelectedLayer
        const al = state.attrData.LayerData[Layernum];
        const odmd = al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
        const oal = state.attrData.LayerData[odmd.o_Layer];
        let OriginP;

        const origin_objn = oal.atrObject.ObjectNum
        if (odmd.O_object > origin_objn) {
            //ダミーオブジェクトが始点の場合
            const Dob = oal.Dummy[odmd.O_object - origin_objn].code;
            OriginP = al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
        } else {
            OriginP = oal.atrObject.atrObjectData[odmd.O_object].CenterPoint;
        }
        const DestP = al.atrObject.atrObjectData[ObNum].CenterPoint;
        const poxy = Generic.Get_OD_Spline_Point(P, OriginP, DestP);
        const pxy = clsSpline.Spline_Get(0, 4, poxy, 0.1, state.attrData.TotalData.ViewStyle.ScrData as any);
        const Cate  = state.attrData.Get_Categoly(Layernum, DataNum, ObNum);
        const O_LPat  = al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.Clone();
        O_LPat.Color=clsBase.ColorRed();
        g.putImageData(state.attrData.TempData.frmPrint_Temp.image, 0, 0);
        state.attrData.Draw_Line(g, O_LPat,  pxy);
    }

    /**線モードのラインの移動チェック */
    function LocationODSearch(ScreenP: point) {
        const state = appState();
        const MapP = state.attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        const odc = Near_OD(MapP);
        if (odc !== -1) {
            const tx4 = "OD" + state.attrData.Get_KenObjName(state.attrData.TotalData.LV1.SelectedLayer, odc);
            const label1 = Frm_Print.label1;
            const label2 = Frm_Print.label2;
            const label3 = Frm_Print.label3;
            if (label1 && label2 && label3) {
                label3.style.left=(label1.offsetWidth+label2.offsetWidth+20).px();
                label3.innerHTML = tx4;
            }
            state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.od;
            return true;
        } else {
            state.attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
            return false;
        }
    }

    /**線モードの最寄りラインを求める */
    function Near_OD(MapP: point){
        const state = appState();
        let Near_ODNumber  = -1;
        switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                const al = state.attrData.LayerData[Layernum];
                const DataNum = al.atrData.SelectedIndex;
                if (al.Print_Mode_Layer === enmLayerMode_Number.SoloMode) {
                    if ((state.attrData.getSoloMode(Layernum, DataNum) === enmSoloMode_Number.ClassODMode) && (
                        al.Shape !== enmShape.LineShape) && (al.Type !== enmLayerType.Trip)) {
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                const ovl = state.attrData.TotalData.TotalMode.OverLay.DataSet[state.attrData.TotalData.TotalMode.OverLay.SelectedIndex];
                for (let i = 0; i < ovl.DataItem.length; i++) {
                    const Layernum = ovl.Layer
                    const DataNum = ovl.DataNumber
                    const al = state.attrData.LayerData[Layernum];
                    if ((ovl.Print_Mode_Layer === enmLayerMode_Number.SoloMode)&& (ovl.Mode === enmSoloMode_Number.ClassODMode) && (
                        al.Shape !== enmShape.LineShape)){
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                        if (Near_ODNumber !== -1) {
                            break;
                        }
                    }
                }
                break;
            }
        }
        return Near_ODNumber;

        function Near_OD_sub(MapP: point, Layernum: number, DataNum: number){
            const state = appState();
            const al=state.attrData.LayerData[Layernum];
            const mod=al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
            const oal=state.attrData.LayerData[mod.o_Layer];
            let StartP ;
            let EndP ;
            const objn  = al.atrObject.ObjectNum;
            const origin_objn  = oal.atrObject.ObjectNum
            if(mod.O_object > origin_objn ){
                //ダミーオブジェクトが始点の場合
                const Dob  = oal.Dummy[mod.O_object - origin_objn].code;
                StartP=al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
            }else{
                StartP = oal.atrObject.atrObjectData[mod.O_object].CenterPoint;
            }

            let mind  = 5;
            const Category_Array = state.attrData.Get_CategolyArray(Layernum, DataNum);
            let Near_Obj  = -1;
            for (let i = 0; i <  objn ; i++) {
                EndP = al.atrObject.atrObjectData[i].CenterPoint;
                const Cate  = Category_Array[i];
                if(Cate !== -1 ){
                    let D ;
                    if (((i === mod.O_object) && (Layernum === mod.o_Layer)) || (
                        (al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.BlankF === false) && (
                            state.attrData.Check_Missing_Value(Layernum, DataNum, i) === false))) {
                        const retV = al.Get_OD_Bezier_RefPoint(i, DataNum);
                        if (retV.ok === false) {
                             D= spatial.Distance_PointLine2(MapP, StartP, EndP).distance;
                        } else {
                            const ControlP = retV.RefPoint;
                            const Refp = Generic.Get_OD_Spline_Point(ControlP, StartP, EndP);
                            const d1 = spatial.Distance_PointLine2(MapP, StartP, Refp[2]).distance;
                            const d2 = spatial.Distance_PointLine2(MapP, Refp[1], Refp[2]).distance;
                            const d3 = spatial.Distance_PointLine2(MapP, EndP, Refp[1]).distance;
                            D = Math.min(d1, d2);
                            D = Math.min(D, d3);
                        }
                        D *= state.attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                        if (D < mind) {
                            mind = D;
                            Near_Obj = i;
                            state.attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos = Near_Obj;
                            state.attrData.TempData.frmPrint_Temp.OD_Drag.Data = DataNum;
                        }
                    }
                }
            }
            return Near_Obj;
        }
    }

    /**等値線の位置とカーソルチェック */
    function LocationContourSearch(ScreenP: point) {
        const state = appState();
        const MapP = state.attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        let tx4 = ""
        if (state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.Normal) {
            state.attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = -1;
            if (Check_Contour_in() === true) {
                const c = Near_Contour(MapP);
                if (c !== -1) {
                    state.attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = c;
                    const cdt = state.attrData.TempData.ContourMode_Temp.Contour_Object[c];
                    tx4 = "等値線" + cdt.Value.toString() + state.attrData.Get_DataUnit(cdt.Layernum, cdt.DataNum);
                    let conDiv=document.getElementById("contourDataTip");
                    if(conDiv===undefined){
                        conDiv=Generic.createNewSpan(Frm_Print as unknown as HTMLElement,tx4,"contourDataTip","",ScreenP.x+5,ScreenP.y+state.scrMargin.top-15,"z-index:2000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#ffffff",undefined)
                    }else{
                        conDiv.innerHTML=tx4;
                        conDiv.style.left=(ScreenP.x+5).px();
                        conDiv.style.top=(ScreenP.y+state.scrMargin.top-15).px();
                    }
                }
            }
        }
        if(tx4===""){
            const dv=document.getElementById("contourDataTip")
            if( dv!==undefined){
                Frm_Print.removeChild(dv);
            }
    }

        // 等値線モードが表示されているかチェック
         function Check_Contour_in() {    
             const state = appState();
             switch (state.attrData.TotalData.LV1.Print_Mode_Total) {
                 case enmTotalMode_Number.DataViewMode: {
                     const Layernum = state.attrData.TotalData.LV1.SelectedLayer;
                     if (state.attrData.LayerData[Layernum].atrData.Count > 0) {
                         const DataNum = state.attrData.LayerData[Layernum].atrData.SelectedIndex;
                         if (state.attrData.getSoloMode(Layernum, DataNum) === enmSoloMode_Number.ContourMode) {
                             return true;
                         }
                     }
                     break;
                 }
                 case enmTotalMode_Number.OverLayMode: {
                     const ato = state.attrData.TotalData.TotalMode.OverLay;
                     const atod = ato.DataSet[ato.SelectedIndex];
                     for (let i = 0; i < atod.DataItem.length; i++) {
                         const atodi = atod.DataItem[i];
                         if ((atodi.Print_Mode_Layer === enmLayerMode_Number.SoloMode) && (atodi.Mode === enmSoloMode_Number.ContourMode)) {
                             return true;
                         }
                     }
                     break;
                 }
            }
            return false;
        }
        // 最寄りの等値線取得
        function Near_Contour(MapP: point) {
            const state = appState();
            let Near_ContourNumber = -1;
            let mind = 5;
            const atc = state.attrData.TempData.ContourMode_Temp;
            for (let i = 0; i < atc.Contour_All_Number; i++) {
                const atco = atc.Contour_Object[i];
                if ((atco.Flag === true) && (spatial.Check_PointInBox(MapP, 0, atco.Circumscribed_Rectangle) === true)) {
                    for (let j = atco.PointStac; j <= atco.PointStac + atco.NumOfPoint - 2; j++) {
                        const retV = spatial.Distance_PointLine(MapP.x,MapP.y, atc.Contour_Point[j].x,atc.Contour_Point[j].y, atc.Contour_Point[j + 1].x, atc.Contour_Point[j + 1].y ) ;
                        const d=retV.distance* state.attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
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
    function LocationSearch(ScreenP: point) {
        const state = appState();
        const MapP  = state.attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        picMapMouseMovePointInformation(ScreenP);
        let L_Print_Mode_Total ;
        let L_Layer ;
        let L_Print_Mode_Layer ;
        let L_Data ;
        let L_Solomode ;
        if( state.attrData.TotalData.LV1.Print_Mode_Total === enmTotalMode_Number.SeriesMode ){
            const koma  = state.attrData.TempData.Series_temp.Koma;
            const n  = state.attrData.TotalData.TotalMode.Series.SelectedIndex;
            const im= state.attrData.TotalData.TotalMode.Series.DataSet[n].DataItem[koma];
                L_Print_Mode_Total = im.Print_Mode_Total;
                L_Print_Mode_Layer = im.Print_Mode_Layer;
                L_Layer = im.Layer;
                L_Data = im.Data;
                L_Solomode = im.SoloMode;
        } else {
            const lv = state.attrData.TotalData.LV1;
            L_Print_Mode_Total = lv.Print_Mode_Total
            L_Layer = lv.SelectedLayer;
            const ld = state.attrData.LayerData[L_Layer];
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
                    L_Data = state.attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                    break;
                }
            }
        }
        switch (L_Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                //データ表示モード
                let OnObject: strLocationSearchObject[] = [];
                const Layernum = L_Layer;
                const dtindex = L_Data;
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
                        if (OnObject.length === 0) {
                            //frm_PropertypnlProperty.Visible = false;
                        } else {
                            if (mnuPropertyWindow.checked === true) {
                                //frm_Property.ShowTripModeProperty(state.attrData, Layernum, OnObject, dtindex);
                            }
                        }
                        break;
                    }
                }
                if (L_Print_Mode_Layer !== enmLayerMode_Number.TripMode) {
                    switch (OnObject.length) {
                        case 0: {
                            state.propertyWindow.pnlProperty?.setVisibility?.(false);
                            if (Frm_Print.label2) {
                                Frm_Print.label2.innerHTML="";
                            }
                            break;
                        }
                        case 1: {
                            if ((typeof state.propertyWindow.getVisibility === "function") && (state.propertyWindow.getVisibility() === true) && (state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.Normal)) {
                                state.frmPrint.ShowOneObjectProperty( Layernum, OnObject[0].ObjNumber, dtindex, state.attrData.LayerData[Layernum].Print_Mode_Layer);
                            }
                            state.attrData.TempData.frmPrint_Temp.LocationMenuString.DataIndex = dtindex;
                            break;
                        }
                        default: {
                            state.frmPrint.ShowOverLayObjectProperty(Layernum,dtindex,  OnObject);
                            break;
                        }
                    }
                }
                let tx = "";
                for (let i = 0; i < OnObject.length; i++) {
                    const onum = OnObject[i].ObjNumber;
                    tx += state.attrData.Get_KenObjName(Layernum, onum) + "［" + state.attrData.Get_Data_Value(Layernum, L_Data, onum, "欠損値") + "］"
                    if (i !== OnObject.length - 1) {
                        tx += "／"
                    }
                }
                if (tx !== "") {
                    if (state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.MultiObjectswitch) {
                        if (state.attrData.TempData.frmPrint_Temp.MultiObjects.indexOf(OnObject[0].ObjNumber) !== -1) {
                            tx += "（選択中）"
                        }
                    }
                }
                if (Frm_Print.label1 && Frm_Print.label2) {
                    Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
                    Frm_Print.label2.innerHTML= tx;
                }
                state.attrData.TempData.frmPrint_Temp.OnObject = OnObject;
                if ((state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.MultiObjectswitch) && (L_Print_Mode_Layer === enmLayerMode_Number.SoloMode)){
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                //重ね合わせモード
                Get_Object_By_XY_OverLayMode(MapP, L_Data);
                break;
            }
        }

        switch (state.attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                state.frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
    }

    /**重ね合わせモードの位置情報 */
    function Get_Object_By_XY_OverLayMode(MapP: point, OverLayIndex: number) {
        const state = appState();
        let tx = "";
        let f = false;
        state.attrData.TempData.frmPrint_Temp.OnObject = [];
        const ato = state.attrData.TotalData.TotalMode.OverLay;
        let lblTxt = ""
        for (let i = ato.DataSet[OverLayIndex].DataItem.length - 1; i >= 0; i--) {
            const d = ato.DataSet[OverLayIndex].DataItem[i];
            const OnObject = NearestObject(MapP, d.Layer);
            for (let j = 0; j < OnObject.length; j++) {
                const ObjData = OnObject[j];
                lblTxt += "レイヤ：" + state.attrData.Get_LayerName(ObjData.objLayer) + '<br>';
                lblTxt += "オブジェクト：" + state.attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber) + '<br>';
                if (f === true) {
                    tx += "／";
                } else {
                    f = true;
                }
                tx += state.attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber);
                switch (d.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode:
                        lblTxt += "　" + state.attrData.getOneObjectPanelLabelString(ObjData.objLayer, d.DataNumber, ObjData.ObjNumber,"<br>　") + '<br>';
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
                state.attrData.TempData.frmPrint_Temp.OnObject.push(ObjData);
            }
        }
        if (typeof state.propertyWindow.getVisibility === "function" && state.propertyWindow.getVisibility() === true) {
            const cnode = state.propertyWindow.pnlProperty.childNodes;
            for (const i in cnode) {
                if (cnode[i].name === "grid") {
                    state.propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
            state.propertyWindow.pnlProperty.setVisibility?.(true);
            if (state.propertyWindow.pnlProperty.objInfo) {
                state.propertyWindow.pnlProperty.objInfo.style.height = '100%';
                state.propertyWindow.pnlProperty.objInfo.innerHTML = lblTxt;
            }
            // if (lblTxt === "") {
            //     frm_Property.pnlOverLayProperty.Visible = false;
            // }
        }
        if (Frm_Print.label1 && Frm_Print.label2) {
            Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
            Frm_Print.label2.innerHTML = tx
        }
    }

    /**一番近いオブジェクトを探して数とオブジェクト番号を返す */
    function NearestObject(MapP: point, Layernum: number) {
        const state = appState();
        const OnObject = [];

        if (state.attrData.LayerData[Layernum].Type === enmLayerType.Trip) {

        } else {
            switch (state.attrData.LayerData[Layernum].Shape) {
                case (enmShape.PolygonShape): {
                    const retV = state.attrData.LayerData[Layernum].PrtSpatialIndex.GetRectIn(MapP.x, MapP.y);
                    if (retV.number > 0) {
                        for (let i = 0; i < retV.number; i++) {
                            if (state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] === true) {
                                if (state.attrData.Check_Point_in_Kencode_OneObject(Layernum, retV.Tags[i], MapP) === true) {
                                    const ObjData =new strLocationSearchObject(Layernum,retV.Tags[i]) ;
                                    OnObject.push(ObjData);
                                }
                            }
                        }
                    }
                    break;
                }
                default: {
                    let retV;
                    const mind = 10 / state.attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                    if (state.attrData.LayerData[Layernum].Shape === enmShape.PointShape) {
                        retV = state.attrData.LayerData[Layernum].PrtSpatialIndex.GetNearPointNumber(MapP.x, MapP.y, mind);
                    } else {
                        retV = state.attrData.LayerData[Layernum].PrtSpatialIndex.GetNearestLineNumber(MapP.x, MapP.y, mind);
                    }
                    if (retV.num > 0) {
                        let serarchNCount = 0;
                        for (let i = 0; i < retV.num; i++) {
                            if (state.attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] === true) {
                                const ObjData = new strLocationSearchObject(Layernum, retV.Tags[i]);
                                OnObject.push(ObjData);
                                serarchNCount++;
                                if (serarchNCount === 5) {//候補は最大で5つ
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
    function picMapMouseMovePointInformation(MousePosition: point) {
        const state = appState();
        const vs = state.attrData.TotalData.ViewStyle;
        const originalP = vs.ScrData.getSRXY(MousePosition);
        if(spatial.Check_PsitionReverse_Enable(originalP, vs.Zahyo)===true){
            const P  = spatial.Get_Reverse_XY(originalP, vs.Zahyo) as point;
            const PSt  = Generic.Get_PositionCoordinate_Strings(P, vs.Zahyo);
            Frm_Print.label1.innerHTML=PSt.x + "/" + PSt.y;
        }else{
            Frm_Print.label1.innerHTML="";
        }
    }

    function Check_Acc(ScreenP: point) {
        const state = appState();
        const vs = state.attrData.TotalData.ViewStyle;
        const threed = vs.ScrData.ThreeDMode;
        const ata = state.attrData.TempData.Accessory_Temp;
        if (vs.MapTitle.Visible === true) {
            if (spatial.Check_PointInBox(ScreenP, vs.MapTitle.Font.Kakudo, ata.MapTitle_Rect) === true) {
                ata.Push_titleXY = vs.MapTitle.Position.Clone();
                return { type: Check_Acc_Result.Title, rect: ata.MapTitle_Rect };
            }
        }
        //------方位
        if ((vs.AttMapCompass.Visible === true) && ((vs.ScrData.ThreeDMode.Set3D_F === false) || ((threed.Pitch === 0) && (threed.Head === 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapCompass_Rect) === true) {
                ata.Push_CompassXY = vs.AttMapCompass.Position.Clone();
                return { type: Check_Acc_Result.Compass, rect: ata.MapCompass_Rect };
            }
        }
        //------スケール
        if ((vs.MapScale.Visible === true) && ((vs.ScrData.ThreeDMode.Set3D_F === false) || ((threed.Pitch === 0) && (threed.Head === 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapScale_Rect) === true) {
                ata.Push_ScaleXY = vs.MapScale.Position.Clone();
                return { type: Check_Acc_Result.Scale, rect: ata.MapScale_Rect };
            }
        }
        //------注
        if (vs.DataNote.Visible === true) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.DataNote_Rect) === true) {
                ata.Push_DataNoteXY = vs.DataNote.Position.Clone();
                return { type: Check_Acc_Result.Note, rect: ata.DataNote_Rect };
            }
        }
        //------凡例
        for (let i = ata.Legend_No_Max - 1; i >= 0; i--) {
            const lg =  ata.MapLegend_W[i];
            if ((vs.MapLegend.Base.Visible === true) || (lg.LineKind_Flag === true) || (lg.PointObject_Flag === true)) {
                if (spatial.Check_PointInBox(ScreenP, 0, lg.Rect) === true) {
                    ata.Edit_Legend = i;
                    ata.Push_LegendXY = state.attrData.TotalData.ViewStyle.MapLegend.Base.LegendXY[i];
                    return { type: Check_Acc_Result.Legend, rect: lg.Rect };
                }
            }
        }
        //------グループボックス
        if ((vs.AccessoryGroupBox.Visible === true) && (vs.ScrData.ThreeDMode.Set3D_F === false)) {
            const Acc_Rect = ata.GroupBox_Rect.Clone();
            const pad = state.attrData.Get_PaddingPixcel(vs.AccessoryGroupBox.Back);
            Acc_Rect.inflate(pad, pad);
            if (spatial.Check_PointInBox(ScreenP, 0, Acc_Rect) === true) {
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
        const state = appState();
        state.frmPrint.savePNG(true)
    }

    //画像ファイルに保存
    static savePNG(WindowOutFlag = false) {
        const state = appState();
        const tilecanvas = document.createElement("canvas");
        tilecanvas.width = state.attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width();
        tilecanvas.height = state.attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height();
        tilecanvas.style.vivility = false;
        const tg = tilecanvas.getContext('2d');
        if (!tg) {
            return;
        }
        tg.fillStyle = "#ffffff";//背後が透過色になるため白にする
        tg.fillRect(0, 0, tilecanvas.width, tilecanvas.height)
        tg.drawImage(Frm_Print.picMap, 0, 0);
        if (WindowOutFlag === true) {
            Generic.windowCenterOpen(tilecanvas.toDataURL(), tilecanvas.width, tilecanvas.height, "MANDARA JS");
        } else {
            Generic.prompt(undefined, "画像ファイル名", "mandara.png", function (v: string) {
                const a = document.createElement('a');
                a.href = tilecanvas.toDataURL();
                a.download = v;
                a.click();
                });
        }
    }

    //線種ラインパターン設定
    static linePattern(_data: JsonValue, e: Event) {
        const state = appState();
        const backDiv = Generic.set_backDiv("", "線種ラインパターン設定", 240, 380, true, true, buttonOK, 0.2, true);
        Generic.Set_Box_Position_in_Browser(e, backDiv);

        Generic.createNewSpan(backDiv, "地図ファイル", "", "", 15, 35, "", "");
        const NewLineKind: LPatSek_Info[][] = [];
        const MapFileList = state.attrData.GetMapFileName()
        const list: Array<{value: string, text: string}> = [];
        for (let i = 0; i < MapFileList.length; i++) {
            const LK = state.attrData.SetMapFile(MapFileList[i]).Get_TotalLineKind();
            NewLineKind.push(LK);
            list.push({ value: MapFileList[i], text: MapFileList[i] });
        }
        const selectDataItem = Generic.createNewSelect(backDiv, list, 0, "", 15, 55, false, mapListchange, "width:210px;");
        const pnlLinePattern = Generic.createNewDiv(backDiv, "", "", "", 15, 85, 210, 200, "overflow-y:scroll;overflow-x:hidden;border:solid 1px;border-color:#666666;", "");
        const pnlLineList = Generic.createNewDiv(pnlLinePattern, "", "", "", 0, 0, 210, 100, "", "");
        let meshf=false;
        for (let i = 0; i < state.attrData.TotalData.LV1.Lay_Maxn; i++) {
            if (state.attrData.LayerData[i].Type === enmLayerType.Mesh) {
                meshf= true;
                break;
            }
        }
        const pnlMeshLine = Generic.createNewDiv(backDiv, "", "", "", 15, 290, 200, 40, "", "");
        const picMeshLine=Generic.createNewWordDivCanvas(pnlMeshLine, "","メッシュデータの輪郭ラインパターン",0,0,100,meshLinePatternClick);
        let MeshLpat=state.attrData.TotalData.ViewStyle.MeshLine.Clone();
        if (meshf === true) {
            pnlMeshLine.setVisibility(true);
            state.attrData.Draw_Sample_LineBox(picMeshLine,MeshLpat );
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop - pnlLinePattern.offsetTop - 5).px();
        } else {
            pnlMeshLine.setVisibility(false);
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop + pnlMeshLine.offsetHeight - pnlLinePattern.offsetTop).px();
        }
        showLinePattern();

        function meshLinePatternClick(e: Event) {
            const state = appState();
            clsLinePatternSet(e as MouseEvent, MeshLpat, LinePatternGet);
            function LinePatternGet(Lpat: Line_Property) {
                const state = appState();
                MeshLpat = Lpat;
                state.attrData.Draw_Sample_LineBox(e.target as HTMLElement, Lpat);
            }
        }
        function mapListchange() {
            const state = appState();
            showLinePattern();
        }
        function buttonOK() {
            const state = appState();
            for (let i = 0; i < MapFileList.length; i++) {
                const lk = [];
                for (const j in NewLineKind[i]) {
                    const d = new LPatSek_Info();
                    d.Pat = NewLineKind[i][j].Pat.Clone();
                    lk.push(d);
                }
                state.attrData.SetMapFile(MapFileList[i]).Set_TotalLineKind(lk);
            }
            state.attrData.TotalData.ViewStyle.MeshLine = MeshLpat.Clone();
            Generic.clear_backDiv();
            clsPrint.printMapScreen(Frm_Print.picMap);
        }

        function showLinePattern(){
            const state = appState();
            const LineKindHeight=35;
            while (pnlLineList.lastChild) {
                pnlLineList.removeChild(pnlLineList.lastChild);
            }
            const Mpindex  = selectDataItem.selectedIndex
            const lnum  = NewLineKind[Mpindex].length;
            pnlLineList.style.height = (lnum * LineKindHeight + 10).px();

            for(let i  = 0 ;i< lnum;i++){
                const lk=NewLineKind[Mpindex][i];
                const y=i * LineKindHeight + 3;
                const lc=Generic.createNewWordDivCanvas(pnlLineList, "",lk.Name,10,y,100,inePatternClick);
                lc.tag=i;
                state.attrData.Draw_Sample_LineBox(lc, lk.Pat);
            }
            function inePatternClick(e: Event){
                const state = appState();
                const target = e.target as HTMLElement;
                if (!target?.tag) { return; }
                const n = target.tag as number;
                clsLinePatternSet(e as MouseEvent, NewLineKind[Mpindex][n].Pat, LinePatternGet);
                function LinePatternGet(Lpat: Line_Property) {
                    const state = appState();
                    NewLineKind[Mpindex][n].Pat = Lpat;
                    state.attrData.Draw_Sample_LineBox(target, Lpat);
                }
            }
        }
}

    static windowClose(){
        const state = appState();
        state.propertyWindow.nextVisible=(typeof state.propertyWindow.getVisibility === "function") ? (state.propertyWindow.getVisibility()===true) : false;
        state.propertyWindow.setVisibility?.(false);
        state.frmPrint.propertyWindowClose();
    }

    static propertyWindowClose(){
        const state = appState();
        state.propertyWindow.fixed=false;
        state.propertyWindow.pnlProperty?.setVisibility?.(false);
        state.propertyWindow.style.borderWidth='1px';    

    }

    //プロパティウインドウの表をコピー
    static copyProperty(){
        const state = appState();
        const toptx=state.propertyWindow.pnlProperty.objInfo.innerText+'\n'+'\n';
        let gridtx="";
        const cnode = state.propertyWindow.pnlProperty.childNodes;
        for(const i in cnode){
            if((cnode[i] as any).name==="grid"){
                gridtx=Generic.getTableValue((cnode[i] as any).table);
                break;
            }
        }
        Generic.copyText(toptx+gridtx);
    }

    //プロパティウインドウの固定・解除
    static PropertyFix() {
        const state = appState();
        if (state.propertyWindow.pnlProperty.getVisibility() === true) {
            const f = !state.propertyWindow.fixed;
            if (f === true) {
                state.propertyWindow.style.borderWidth = '2px';
            } else {
                state.propertyWindow.style.borderWidth = '1px';
            }
            state.propertyWindow.fixed = f;
        }
    }

    //複数オブジェクトのプロパティ表示
    static ShowOverLayObjectProperty(Layernum: number, dtindex: number, OnObject: strLocationSearchObject[]) {
        const state = appState();
        if ((state.propertyWindow.pnlProperty.getVisibility()===true) && (state.attrData.TempData.frmPrint_Temp.PrintMouseMode === enmPrintMouseMode.Normal)) {
            const cnode = state.propertyWindow.pnlProperty.childNodes;
            for(const i in cnode){
                if(cnode[i].name==="grid"){
                    state.propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
        }
        state.propertyWindow.pnlProperty.setVisibility(true);
        let ptx = "";
        for (let i = 0; i < OnObject.length; i++) {
            ptx += state.attrData.Get_KenObjName(Layernum, OnObject[i].ObjNumber) + '<br>' +
                state.attrData.Get_DataTitle(Layernum, dtindex, false) + ":" +
                state.attrData.Get_Data_Value(Layernum, dtindex, OnObject[i].ObjNumber, state.attrData.TotalData.ViewStyle.Missing_Data.Label) +
                state.attrData.Get_DataUnit_With_Kakko(Layernum, dtindex);
            if (i !== OnObject.length - 1) {
                ptx += '<br>' + '<br>';
            }
            state.propertyWindow.pnlProperty.objInfo.style.height = '100%';
            state.propertyWindow.pnlProperty.objInfo.innerHTML = ptx;
        }
    }

    //1オブジェクトのプロパティ表示
    static ShowOneObjectProperty(LayerNum: number, objNumber: number, DataNumber: number, LayerMode: number) {
        const state = appState();
        if ((state.propertyWindow.oObject === objNumber) && (state.propertyWindow.oLayer === LayerNum) && (state.propertyWindow.oData === DataNumber) && (state.propertyWindow.pnlProperty.getVisibility() === true)) {
            return;
        }
        let headTx="";
        let headHeight = 0;
        state.propertyWindow.pnlProperty?.setVisibility?.(true);

        const cnode = state.propertyWindow.pnlProperty.childNodes;
        for (const i in cnode) {
            if (cnode[i].name === "grid") {
                state.propertyWindow.pnlProperty.removeChild(cnode[i]);
                break;
            }
        }
        let data = [];
        switch (LayerMode) {
            case enmLayerMode_Number.SoloMode: {
                headTx = "<b>" + state.attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headTx+=state.attrData.getOneObjectPanelLabelString(LayerNum, DataNumber, objNumber, '<br>' + " ");
                headHeight=90;
                const n = state.attrData.Get_DataNum(LayerNum);
                data = Generic.Array2Dimension(n + 1, 3);
                data[0][0] = "データ項目";
                data[0][1] = "値";
                data[0][2] = "単位";
                for (let i = 0; i < n; i++) {
                    data[i + 1][0] = state.attrData.Get_DataTitle(LayerNum, i, true);
                    data[i + 1][1] = state.attrData.Get_Data_Value(LayerNum, i, objNumber, "");
                    data[i + 1][2] = state.attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
            case enmLayerMode_Number.GraphMode: {
                headTx = "<b>" + state.attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                const al=state.attrData.LayerData[LayerNum];
                const Dset  = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                const ald=al.LayerModeViewSettings.GraphMode.DataSet[Dset];
                const DataItem = ald.Data;
                const n = DataItem.length;
                if (n === 0) {
                    return;
                }
                switch (ald.GraphMode) {
                    case enmGraphMode.PieGraph:
                    case enmGraphMode.StackedBarGraph: {
                        data = Generic.Array2Dimension(3, n + 2);
                        data[0][0] = "データ項目";
                        data[1][0] = "値(" + state.attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        data[2][0] = "割合(%)";
                        let sum = 0;
                        const v = [];
                        for (let i = 0; i < n; i++) {
                            data[0][i + 1] = state.attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            const val = Number(state.attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
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
                        data = Generic.Array2Dimension(2, n + 5);
                        data[0][0] = "データ項目";
                        data[1][0] = "値(" + state.attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        let sum = 0;
                        const v = [];
                        for (let i = 0; i < n; i++) {
                            data[0][i + 1] = state.attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            const val =Number( state.attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
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
                headTx = "<b>" + state.attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                const al=state.attrData.LayerData[LayerNum];
                const Dset  = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                const ald=al.LayerModeViewSettings.LabelMode.DataSet[Dset];
                const DataItem = ald.DataItem;
                const n = DataItem.length;
                data = Generic.Array2Dimension(n + 1, 3);
                data[0][0] = "データ項目";
                data[0][1] = "値";
                data[0][2] = "単位";
                for (let i = 0; i < n; i++) {
                    data[i + 1][0] = state.attrData.Get_DataTitle(LayerNum, DataItem[i], true);
                    data[i + 1][1] =  state.attrData.Get_Data_Value(LayerNum, DataItem[i], objNumber, "");
                    data[i + 1][2] = state.attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
        }
        state.propertyWindow.pnlProperty.objInfo.innerHTML = headTx;
        state.propertyWindow.pnlProperty.objInfo.style.height = headHeight.px();
        state.propertyWindow.oObject = objNumber;
        state.propertyWindow.oLayer = LayerNum;
        state.propertyWindow.oData = DataNumber;

        const y=state.propertyWindow.pnlProperty.objInfo.offsetHeight;
        const gd=Generic.createNewGrid(state.propertyWindow.pnlProperty, "", "", "", "", data, 0, y, '100%', state.propertyWindow.pnlProperty.offsetHeight - 70,'100%', "", "font-size:13px", 1, "background-color:#aaffaa;",  "", "", "");
        gd.name="grid";
}

    static set_frmPrint_Window_Size() {
        const state = appState();
        const FpicRect  = state.attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize;
        const marginSide = state.scrMargin.side ?? 0;
        const marginTop = state.scrMargin.top ?? 0;
        const marginBottom = state.scrMargin.bottom ?? 0;
        Frm_Print.style.left = (FpicRect.left - marginSide).px();
        Frm_Print.style.top = (FpicRect.top - marginTop).px();
        Frm_Print.style.width =(FpicRect.width() + marginSide*2).px();
        Frm_Print.style.height = (FpicRect.height() + marginTop + marginBottom).px();
        state.propertyWindow.style.left=(Frm_Print.style.left.removePx()+Frm_Print.style.width.removePx()+10).px();
        state.propertyWindow.style.top=(Frm_Print.style.top.removePx()+marginTop).px();
        state.propertyWindow.style.height=Frm_Print.style.height;
        Generic.moveInnerElement(state.propertyWindow);
        this.resizeMapWindow();
    }
    
    static resizeMapWindow() {
        const state = appState();
        const mapDIV = Frm_Print.picMap.parentElement as HTMLElement | null;
        if (!mapDIV) { return; }
        const marginSide = state.scrMargin.side ?? 0;
        const marginTop = state.scrMargin.top ?? 0;
        const marginBottom = state.scrMargin.bottom ?? 0;
        Frm_Print.picMap.style.left = marginSide.px();
        Frm_Print.picMap.style.top = marginTop.px();
        Frm_Print.picMap.width = mapDIV.style.width.removePx() - marginSide * 2;
        Frm_Print.picMap.height = mapDIV.style.height.removePx() - marginTop - marginBottom;
        const p = new point(Frm_Print.style.left.removePx() + state.scrMargin.side, Frm_Print.style.top.removePx() + state.scrMargin.top);
        const s = new size(Frm_Print.picMap.width, Frm_Print.picMap.height);
        state.attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        Generic.moveInnerElement(Frm_Print);
        if(Frm_Print.maxSizeFlag===false){
            Frm_Print.oldpos=new rectangle(new point(Frm_Print.style.left.removePx(),Frm_Print.style.top.removePx()),
                        new size(Frm_Print.style.width.removePx(),Frm_Print.style.height.removePx()));
        }
        Frm_Print.resetMaxButton?.(!Frm_Print.maxSizeFlag);
        if (typeof Frm_Print.getVisibility === "function" && Frm_Print.getVisibility() === true) {
            clsPrint.printMapScreen(Frm_Print.picMap);
        }
    }
    static Init_FrmPrint() {
        const state = appState();
        const ScreenH = Generic.getBrowserHeight();
        const ScreenW = Generic.getBrowserWidth();
    
        let a = ScreenH * 0.7;
        if (ScreenH > ScreenW) {
            a = ScreenW * 0.7;
        }
        const marginSide = state.scrMargin.side ?? 0;
        const marginTop = state.scrMargin.top ?? 0;
        const marginBottom = state.scrMargin.bottom ?? 0;
        const psw = a + marginSide * 2;
        const psh = a / 1.41 + marginTop + marginBottom;
    
        const p = new point(ScreenW / 2 - psw / 2, ScreenH / 2 - psh / 2);
        const s = new size(psw, psh);
        state.attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        Frm_Print.resetMaxButton?.(true);
        if (Frm_Print.label1) Frm_Print.label1.innerHTML="";
        if (Frm_Print.label2) Frm_Print.label2.innerHTML="";
        if (Frm_Print.label3) Frm_Print.label3.innerHTML="";
    }
    

    /**連続表示ボタン 次*/
    static seriesNext() {
        const state = appState();
        const ats = state.attrData.TotalData.TotalMode.Series;
        const n = ats.SelectedIndex;
        const atst = state.attrData.TempData.Series_temp;
        atst.Koma = (atst.Koma === ats.DataSet[n].DataItem.length - 1) ? 0 : atst.Koma+1;
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    /**連続表示ボタン 前*/
    static seriesBefore() {
        const state = appState();
        const ats = state.attrData.TotalData.TotalMode.Series;
        const n = ats.SelectedIndex;
        const atst = state.attrData.TempData.Series_temp;
        atst.Koma  = (atst.Koma === 0) ? ats.DataSet[n].DataItem.length - 1 : atst.Koma-1;
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //全体表示ボタン
    static wholeMapShow() {
        const state = appState();
        state.attrData.TotalData.ViewStyle.ScrData.ScrView = state.attrData.TotalData.ViewStyle.ScrData.MapRectangle.Clone();
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //カーソル位置のオブジェクトを強調
    static PrintCursorObjectLine(g: CanvasRenderingContext2D, Draw_F: boolean) {
        const state = appState();
        const OnObject = state.attrData.TempData.frmPrint_Temp.OnObject;
        const OldObject = state.attrData.TempData.frmPrint_Temp.OldObject;
        if (OnObject.length === 0) {
            if (OldObject.length > 0) {
                g.putImageData(state.attrData.TempData.frmPrint_Temp.image, 0, 0);
                state.attrData.TempData.frmPrint_Temp.OldObject = [];
            }
            return;
        } else {
            if ((OnObject.length === OldObject.length) && (Draw_F === false)) {
                //ちらつき防止のため、描画済みの場合は再描画しない
                let f = false;
                for (const i in OnObject) {
                    for (const j in OldObject) {
                        if ((OnObject[i].ObjNumber !== OldObject[j].ObjNumber) || (OnObject[i].objLayer !== OldObject[j].objLayer)) {
                            f = true;
                            break;
                        }
                    }
                }
                if (f === false) {
                    return;
                }
            }
        }
        g.putImageData(state.attrData.TempData.frmPrint_Temp.image, 0, 0);
        state.attrData.TempData.frmPrint_Temp.OldObject = Generic.ArrayClone(OnObject);
        for (const i in OnObject) {
            printSelectedObject(g, OnObject[i].objLayer, OnObject[i].ObjNumber);
        }

        function printSelectedObject(g: CanvasRenderingContext2D, Layernum: number, ObjNum: number) {
            const state = appState();
            const sp = state.attrData.LayerData[Layernum].Shape;
            switch (sp) {
                case enmShape.PointShape: {
                    const CP = state.attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Symbol;
                    const OP = state.attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                    const Mk = clsBase.Mark();
                    Mk.Tile.Color = new colorRGBA(255, 0, 150, 150);
                    state.attrData.Draw_Mark(g, OP, 10, Mk)
                    break;
                }
                case enmShape.LineShape:
                case enmShape.PolygonShape: {

                    let w = 3;
                    if (sp === enmShape.LineShape) {
                        w = 5;
                    }
                    if (state.attrData.LayerData[Layernum].Type === enmLayerType.Mesh) {
                        const meshP = Generic.ArrayClone(state.attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MeshPoint);
                        meshP[4] = meshP[0].Clone();
                        const pxy = state.attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(5, meshP, false);
                        drawLines(g, pxy, 3, new colorRGBA(255, 0, 150, 200));
                    } else {
                        const ELine = state.attrData.Get_Enable_KenCode_MPLine(Layernum, ObjNum);
                        for (const j in ELine) {
                            const pxy = clsPrint.Get_PointXY_by_LineCode(Layernum, ELine[j].LineCode, false);
                            if (pxy !== undefined) {
                                drawLines(g, pxy, w, new colorRGBA(255, 0, 150, 150));
                            }
                        }
                    }
                    break;
                }
            }
            function drawLines(g: CanvasRenderingContext2D, pxy: point[], w: number, col: colorRGBA) {
                const state = appState();
                g.lineWidth = w;
                g.strokeStyle = col.toRGBA();
                g.beginPath();
                g.moveTo(pxy[0].x, pxy[0].y);
                pxy.forEach(function (p: point) {
                    g.lineTo(p.x, p.y);
                });
                g.stroke();
            }
        }
    }
}

// Ensure module scope for TypeScript
export {};


