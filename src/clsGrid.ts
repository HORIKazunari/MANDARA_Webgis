import { appState } from './core/AppState';
import { ListBox } from './clsGeneric';
import { gridControl, type EventCallbacks } from './clsGridControl';
import type { JsonObject, JsonValue } from './types';
import { SortingSearch } from './SortingSearch';

type LayerTypeValue = (typeof enmLayerType)[keyof typeof enmLayerType];
type ShapeValue = (typeof enmShape)[keyof typeof enmShape];
type MeshNumberValue = (typeof enmMesh_Number)[keyof typeof enmMesh_Number];
type AttDataTypeValue = (typeof enmAttDataType)[keyof typeof enmAttDataType];

type _GridLayerDataInfo = {
    MapFile: string;
    Type: string;
    Shape: string;
    Time: string;
    OldIndex: string;
    Mesh: string;
    SyntheticObjF: string;
    Comment: string;
    ReferenceSystem: string;
};

class Layer_Data_Info {
    Data = 0; // Integer
    Layer = 0; // Integer
}

class Layer_Data_InfoCheck {
    Data = 0; // Integer
    Layer = 0; // Integer
    Value = 0; // Double
}

function clsGrid(_newDataFlag: boolean, buttonOK: (newAttr: clsAttrData) => void){
    // const state = appState();
    const GridLayerData = {
        MapFile: "MapFile" as const,
        Type: "Type" as const,
        Shape: "Shape" as const,
        Time: "Time" as const,
        OldIndex: "OldIndex" as const,
        Mesh: "Mesh" as const,
        SyntheticObjF: "SyntheticObjF" as const,
        Comment: "Comment" as const,
        ReferenceSystem: "ReferenceSystem" as const
    };
    
    // 関数の前方宣言
    let Check_DataKind: (Layernum: number) => void;
    let Set_LayerTypeShape: () => void;
    let ErrorCheck: () => boolean;
    let setIniform: () => void;
    let set_First_GridCellWidthHeight: (Layernum: number) => void;
    let Get_Data_Property_Value: (_attrData: clsAttrData, Layernum: number, DataNum: number) => number;
    let check_DataKind_and_Allignment: (Layernum: number) => void;
    let SetMapFileList_to_CboBox: () => void;
    let Get_E_Data: () => { ok: boolean; emes: string };
    let Reset_SCRView_Size: () => void;
    let btnReplaceMapfileClick: () => void;
    let btnRemoveMapfileClick: () => void;
    let btnAddMapfile: () => void;
    
    // パラメータから実際の値を取得
    const newDataFlag = _newDataFlag;
    
    const _Change_Data = false;
    let ZahyoOk = false; // Boolean
    const newAttrData=new clsAttrData();
    let SearchSTR=""; // String
    let D_CheckDataValue: number[][] = []; // List(Of Double())
    const oldAttrData=state.attrData; // clsAttrData
    const gridTopY=150;
    const layerDataWidth=200;
    let gScreenWidth =( Generic.getBrowserWidth()-50*2);
    let gScreenHeight = (Generic.getBrowserHeight() - 100);
    const backDiv = Generic.set_backDiv("", "属性データ編集", gScreenWidth, gScreenHeight, false, false, () => buttonOK(newAttrData), 0.2, false, false);
    const picTop = Generic.createNewDiv(backDiv, "", "", "", 0, 30, gScreenWidth, 100, "", undefined);
    Generic.createNewButton(picTop, "OK", "", 480, 20, okButton, "width:70px;height:25px");
    Generic.createNewButton(picTop, "Cancel", "", 480, 50, cancelButton, "width:70px;height:25px");
    const gbMapFile=Generic.createNewFrame(picTop,"","",10,10,220,90,"地図ファイル");
    const lstMapFile = new ListBox(gbMapFile, "", [], 10, 10, 120, 70, undefined, "");
    const btnReplaceMapFile =Generic.createNewButton(gbMapFile, "差し替え", "", 140, 10, btnReplaceMapfileClick, "width:70px;font-size:10.5px");
    const btnRemoveMapfile = Generic.createNewButton(gbMapFile, "削除", "", 140, 35, btnRemoveMapfileClick, "width:70px;font-size:10.5px");
    Generic.createNewButton(gbMapFile, "追加", "", 140, 60,  btnAddMapfile, "width:70px;font-size:10.5px");
    const gbSearch=Generic.createNewFrame(picTop,"","",240,10,190,40,"検索");
    Generic.createNewButton(gbSearch, "検索", "", 10, 10, function(){
        ktGrid.removeEventlister();
        const okCall = (v: string) => {
            ktGrid.addEventlister();
            SearchSTR = v;
            if (v !== "") {
                ktGrid.Find(SearchSTR, enmMatchingMode.PartialtMatching);
            }
        };
        const cancelCall = () => { ktGrid.addEventlister(); };
        Generic.prompt(undefined,"検索文字列",SearchSTR,okCall,'left',cancelCall);
    }, "width:70px;");
    Generic.createNewButton(gbSearch, "前", "", 90, 10, function () {
        if (SearchSTR !== "") {
            ktGrid.FindRev(SearchSTR, enmMatchingMode.PartialtMatching);
        }
    }, "width:40px;");
    Generic.createNewButton(gbSearch, "次", "", 140, 10, function(){
        if (SearchSTR !== "") {
            ktGrid.Find(SearchSTR, enmMatchingMode.PartialtMatching);
        } 
    }, "width:40px;");
    const btnAddDefAttr=Generic.createNewButton(picTop, "初期属性追加", "", 240, 70, function(){
        alert("この機能は作成中です")}, "width:100px;");
    const btnObjectNameCopy = Generic.createNewButton(picTop, "オブジェクト名\nコピーパネル", "", 350, 70, function () {
        ktGrid.removeEventlister();
        const mp = newAttrData.SetMapFile(ktGrid.getLayerData(ktGrid.getLayer(), GridLayerData.MapFile));
        const init_para = new strFrmCopyObjectName_init_parameter_data();
        init_para.Time = ktGrid.getLayerData(ktGrid.getLayer(), GridLayerData.Time);
        init_para.ObjectGroupChecked.length = mp.Map.OBKNum;
        init_para.ObjectGroupChecked.fill(true);
        init_para.TimeChangeEnabled=!init_para.Time.nullFlag();
        frmCopyObjectName(mp,init_para,function (copyData: string) {
            Generic.copyText(copyData);
            ktGrid.setCopyText(copyData);
            ktGrid.addEventlister();
        },
            function () { ktGrid.addEventlister(); })
    }, "width:100px;font-size:10.5px");
    
    const sideLeft = (gScreenWidth - layerDataWidth - 10);
    const gbLayerData=Generic.createNewFrame(backDiv,"","",sideLeft,gridTopY,layerDataWidth,gScreenHeight - gridTopY-20,"");
    gbLayerData.style.overflow='auto';
    Generic.createNewSpan(gbLayerData,"レイヤコメント","","",10,15,"",undefined);
    const txtLayerComment=Generic.createNewTextarea(gbLayerData,"","",20,35,10,10,"font-size:12px;width:140px;height:100px;resize:none;")
    const cboLayerMapFile=Generic.createNewWordSelect(gbLayerData,"レイヤで使用する地図ファイル",[],0,"",10,150,undefined,140,1,function(){},"","",false);
    const cboLayerType=Generic.createNewWordSelect(gbLayerData,"レイヤの種類",[],0,"",10,205,undefined,140,1,function(obj: HTMLSelectElement, sel: number, ltype: LayerTypeValue){
        const lay=ktGrid.getLayer();
        ktGrid.setLayerData(lay, GridLayerData.Type, ltype);
        Check_DataKind(lay);
        ktGrid.setLayerData(lay, GridLayerData.MapFile,cboLayerMapFile.getText());
        switch (ltype) {
            case enmLayerType.DefPoint:
                ktGrid.setLayerData(lay, GridLayerData.Shape, enmShape.PointShape);
                break;
            case enmLayerType.Mesh:
                ktGrid.setLayerData(lay, GridLayerData.Shape, enmShape.PolygonShape);
                if (ktGrid.getLayerData(lay, GridLayerData.Mesh) === enmMesh_Number.mhNonMesh) {
                    ktGrid.setLayerData(lay, GridLayerData.Mesh, enmMesh_Number.mhThird);
                }
                break;
        }
        Set_LayerTypeShape()
        ktGrid.refresh();
        ErrorCheck();
    }, "", "", false);
    const cboLayerShape = Generic.createNewWordSelect(gbLayerData, "レイヤの形状", [], 0, "", 10, 260, undefined, 100, 1, function (obj: HTMLSelectElement, sel: number, v: ShapeValue) {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Shape, v);
        ErrorCheck();
    }, "", "", false);
    const cboMesh = Generic.createNewWordSelect(gbLayerData, "メッシュ", [], 0, "", 10, 315, undefined, 100, 1, function (obj: HTMLSelectElement, sel: number, v: MeshNumberValue) {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Mesh, v);
        ErrorCheck();
    }, "", "", false);
    Generic.createNewSpan(gbLayerData, "時期設定", "", "", 10, 370, "", "");
    const DateTimePickerLayer = Generic.createNewInput(gbLayerData, "date", "", "", 20, 390, "", "width:130px");
    DateTimePickerLayer.onchange = function () {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Time, clsTime.GetFromInputDate(DateTimePickerLayer.value) as unknown as JsonValue);
        ErrorCheck();
    }
    //layerTime.onchange = layerTimeChange;
    const zahyoSystemFrame = Generic.createNewFrame(gbLayerData, "", "", 10, 415, 140, 60, "測地系");
    const ZahyoModeList = [{ value: enmZahyo_System_Info.Zahyo_System_tokyo, text: "日本測地系" },
    { value: enmZahyo_System_Info.Zahyo_System_World, text: "世界測地系" }];
    Generic.createNewRadioButtonList(zahyoSystemFrame, "zahyoSystem", ZahyoModeList, 10, 10,undefined, 22,undefined, undefined, "");

    const errorBox=Generic.createNewDiv(picTop,"エラー情報","","",sideLeft,20,layerDataWidth,20,"",undefined);
    const errorInfo=Generic.createNewTextarea(picTop,"","",sideLeft,40,10,10,"font-size:12px;width:200px;height:70px;resize:none")
    errorInfo.readOnly=true;
    
    const ktGrid = new gridControl(backDiv, 10, gridTopY, gScreenWidth-layerDataWidth-30, gScreenHeight - gridTopY-10,clsSettingData.SetFont);
    const opeEnable= {
        RightClickEnabled:true, //  'グリッド上の右クリックでコピー以外は使えなくする
        RightClickAllEnabled:true, //  '右クリックメニューの使用可否
        InputEnabled:true, //  '入力の可否
        GridRowEnabled:true, //  '行削除・挿入
        GridColEnabled:true, //  '列削除・挿
        FixedXSEnabled:true, //  '左固定領域の変更
        FixedYSEnabled:true, //  '上固定領域の変更
        FixedUpperLeftEnabeld:false, //  '左上固定領域の変更
        TABvisible:true, //'レイヤタブを表示
        TabClickEnabled:true //'タブで右クリックメニュー利用
    };
    const eventCall={
        evtChange_Data:eventChange_Data,//データがどこか変更された場合に発生
        evtAdd_Layer:Add_Layer,//レイヤの追加メニューを選択した場合に発生
        evtChange_LayerSelect:Change_LayerSelect,//表示レイヤを変更した場合に発生
        evtClick_FixedYS2:Click_FixedYS2,//上部の固定部分の枠２行目をクリックした場合に発生
        evtClick_DataGrid:Click_DataGrid,//データ部分をクリックした場合に発生
        evtChange_FixedYS:Change_FixedYS,//上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_FixedXS:Change_FixedXS,//左部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_FixedUpperLeft:Change_FixedUpperLeft,//左上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_Layer:Change_Layer//レイヤ名の変更、レイヤの移動などで発生
      }
    setIniform();
    ktGrid.init("レイヤ", "オブジェクト", "属性データ",  2, 1, 6, 3, opeEnable, eventCall as EventCallbacks);
    if (newDataFlag === true) {
        ktGrid.addLayer("新しいレイヤ", 0, 5, 50);
        ktGrid.setLayerData(0, GridLayerData.Shape, enmShape.NotDeffinition);
        ktGrid.setLayerData(0, GridLayerData.Time, clsTime.GetNullYMD() as unknown as JsonValue);
        ktGrid.setLayerData(0, GridLayerData.OldIndex, -1);
        ktGrid.setLayerData(0, GridLayerData.Type, enmLayerType.Normal);
        ktGrid.setLayerData(0, GridLayerData.Mesh, enmMesh_Number.mhNonMesh);
        ktGrid.setLayerData(0, GridLayerData.SyntheticObjF, false);
        ktGrid.setLayerData(0, GridLayerData.ReferenceSystem, enmZahyo_System_Info.Zahyo_System_World);
        ktGrid.setLayerData(0, GridLayerData.Comment, "");
        for (let i = 0; i < ktGrid.getXsize(0); i++) {
            ktGrid.setFixedYSData(0, i, 2, Generic.ConvertMissingValueFromBool(false));
        }
        set_First_GridCellWidthHeight(0);
        const newTL = newAttrData.TotalData.LV1;
        newTL.DataSourceType = enmDataSource.DataEdit;
        newTL.FileName = "DataEditor";
        newTL.FullPath = "DataEditor";
        btnRemoveMapfile.disabled = true
        btnReplaceMapFile.disabled = true
        btnObjectNameCopy.disabled = true
        btnAddDefAttr.disabled = true
        //  ktGrid.Visible = false
        gbSearch.disabled = true
    } else {
        const Mapfiles = state.attrData.GetMapFileName();
        if (Mapfiles.length > 0) {
            const adLst = [];
            for (let i = 0; i < Mapfiles.length; i++) {
                adLst.push({ text: Mapfiles[i], value: String(i) });
            }
            lstMapFile.addList(adLst, 0);
            for (let i = 0; i < Mapfiles.length; i++) {
                newAttrData.AddExistingMapData(state.attrData.SetMapFile(Mapfiles[i]), Mapfiles[i]);
            }
            lstMapFile.setSelectedIndex(0);
        }
        D_CheckDataValue = [];

        for (let i = 0; i < state.attrData.TotalData.LV1.Lay_Maxn; i++) {
            const al = state.attrData.LayerData[i];
            const Datan = al.atrData.Count;
            const URLMax = state.attrData.Get_MaxURLNum(i);
            let DefPointPlus = 0;
            if (al.Type === enmLayerType.DefPoint) {
                DefPointPlus = 2;
            }
            const d = [];
            for (let j = 0; j < al.atrData.length; j++) {
                d[j] = Get_Data_Property_Value(state.attrData as clsAttrData, i, j);
            }
            D_CheckDataValue.push(d);
            let SideE = true;
            let SyntheticObjF = false;
            if (al.atrObject.NumOfSyntheticObj > 0) {
                //合成オブジェクトはオブジェクト名を変更しない
                SyntheticObjF = true;
                SideE = false;
            }
            const layOpeEnable = {
                RightClickEnabled: true, //  'グリッド上の右クリックでコピー以外は使えなくする
                RightClickAllEnabled: true, //  '右クリックメニューの使用可否
                InputEnabled: true, //  '入力の可否
                GridRowEnabled: SideE, //  '行削除・挿入
                GridColEnabled: true, //  '列削除・挿
                FixedXSEnabled: SideE, //  '左固定領域の変更
                FixedYSEnabled: true, //  '上固定領域の変更
                FixedUpperLeftEnabeld: false, //  '左上固定領域の変更
            };
            ktGrid.addLayer(al.Name, i, Math.max(1, al.atrData.Count) + DefPointPlus + URLMax * 2, Math.max(al.atrObject.ObjectNum, 1), layOpeEnable);
            if (al.Type === enmLayerType.DefPoint) {
                ktGrid.setFixedYSData(i, 0, 3, "LON");
                ktGrid.setFixedYSData(i, 1, 3, "LAT");
            }
            for (let j = 0; j < Datan; j++) {
                const ald = al.atrData.Data[j];
                ktGrid.setFixedYSData(i, DefPointPlus + j, 2, Generic.ConvertMissingValueFromBool(ald.MissingF));
                ktGrid.setFixedYSData(i, DefPointPlus + j, 3,ald.Title);
                ktGrid.setFixedYSData(i, DefPointPlus + j, 4, ald.Unit);
                ktGrid.setFixedYSData(i, DefPointPlus + j, 5, ald.Note);
            }
            for (let k = 0; k < al.atrObject.ObjectNum; k++) {
                ktGrid.setFixedXSData(i, 1, k, state.attrData.Get_KenObjName(i, k));
                const alo = al.atrObject.atrObjectData[k];
                if (al.Type === enmLayerType.DefPoint) {
                    ktGrid.setGridData(i, 0, k,String( alo.defPoint.lon));
                    ktGrid.setGridData(i, 1, k,String( alo.defPoint.lat));
                }
                for (let j = 0; j < al.atrData.Count; j++) {
                    ktGrid.setGridData(i, DefPointPlus + j, k, String(al.atrData.Data[j].Value[k]));
                }
                for (let j = 0; j < alo.HyperLinkNum; j++) {
                    ktGrid.setGridData(i, DefPointPlus + Datan + j * 2, k, alo.HyperLink[j].Name);
                    ktGrid.setGridData(i, DefPointPlus + Datan + j * 2 + 1, k, alo.HyperLink[j].Address);
                }
            }
            for (let j = 0; j < URLMax; j++) {
                ktGrid.setFixedYSData(i, Datan + j * 2, 3, "URL_NAME");
                ktGrid.setFixedYSData(i, Datan + j * 2 + 1, 3, "URL");
            }
            check_DataKind_and_Allignment(i);
            ktGrid.setLayerData(i, GridLayerData.MapFile, al.MapFileName);
            ktGrid.setLayerData(i, GridLayerData.Shape, al.Shape);
            ktGrid.setLayerData(i, GridLayerData.Time, al.Time as unknown as JsonValue);
            ktGrid.setLayerData(i, GridLayerData.OldIndex, i);
            ktGrid.setLayerData(i, GridLayerData.Type, al.Type);
            ktGrid.setLayerData(i, GridLayerData.Mesh, al.MeshType);
            ktGrid.setLayerData(i, GridLayerData.SyntheticObjF, SyntheticObjF);
            ktGrid.setLayerData(i, GridLayerData.ReferenceSystem, al.ReferenceSystem);
            ktGrid.setLayerData(i, GridLayerData.Comment, al.Comment);
            set_First_GridCellWidthHeight(i);
            const atl = state.attrData.TotalData.LV1;
            newAttrData.TotalData.LV1.DataSourceType = atl.DataSourceType;
            newAttrData.TotalData.LV1.FileName = atl.FileName;
            newAttrData.TotalData.LV1.FullPath = atl.FullPath;
            newAttrData.TotalData.LV1.Comment = atl.Comment;
            }
    }
    ktGrid.show();
    window.addEventListener('resize',windowResize );
    SetMapFileList_to_CboBox();
    Check_DataKind(0);
    Set_LayerTypeShape();
    ErrorCheck();

    /**ブラウザのリサイズイベントでサイズ変更 */
    function windowResize(){
        gScreenWidth = (Generic.getBrowserWidth() - 50 * 2);
        gScreenHeight = (Generic.getBrowserHeight() - 100);
        const sideLeft = (gScreenWidth - layerDataWidth - 10).px();
        backDiv.style.width = gScreenWidth.px();
        backDiv.style.height = gScreenHeight.px();
        gbLayerData.style.left = sideLeft;
        gbLayerData.style.height = (gScreenHeight - gridTopY - 20).px();
        ktGrid.changeSize(gScreenWidth - layerDataWidth - 30, gScreenHeight - gridTopY - 10);
        errorBox.style.left = sideLeft;
        errorInfo.style.left = sideLeft;
    }
    function okButton(){
        if( ErrorCheck() === true){
            Generic.alert(undefined, "エラーがあります");
            return;
        }
        const retv = Get_E_Data();
        if (retv.ok === false) {
            Generic.alert(undefined,retv.emes);
            return;
        }
        newAttrData.Check_LayerShape();
        if(newDataFlag === true ){
            newAttrData.initTotalData_andOther();
            newAttrData.attrGridZahyoSet();
        }else{
            newAttrData.TotalData.ViewStyle = oldAttrData.TotalData.ViewStyle.Clone();
            newAttrData.attrGridZahyoSet();
            if(newAttrData.TotalData.ViewStyle.Zahyo.Mode !== enmZahyo_mode_info.Zahyo_Ido_Keido ){
                newAttrData.TotalData.ViewStyle.TileMapView.Visible = false;
            }
            const retV=  spatial.Check_Zahyo_Projection_Convert_Enabled(newAttrData.TotalData.ViewStyle.Zahyo, oldAttrData.TotalData.ViewStyle.Zahyo);
            ZahyoOk=retV.ok ;
            if(ZahyoOk === true ){
                oldAttrData.Convert_Zahyo(newAttrData.TotalData.ViewStyle.Zahyo);
            }
            Check_Data();
            Reset_SCRView_Size();
            newAttrData.LinePatternCheck();
            newAttrData.PrtObjectSpatialIndex();
        }
        ktGrid.removeEventlister();
        window.removeEventListener('resize',windowResize);
        Generic.clear_backDiv();
        buttonOK(newAttrData);
    }
    function cancelButton(){
        ktGrid.removeEventlister();
        window.removeEventListener('resize',windowResize);
        Generic.clear_backDiv();
    }

    /**データがどこか変更された場合に発生 */
    function eventChange_Data() {
        // console.log("Change_Data");
        ErrorCheck();
    }
    /**レイヤの追加メニューを選択した場合に発生 */
    function Add_Layer(InsertPoint: number) {
        const w=[];
        for(let i  = 0;i< ktGrid.getLayerMax() ;i++){
            w.push(ktGrid.getLayerName(i));
        }

        ktGrid.setLayerData(InsertPoint, GridLayerData.Shape,enmShape.NotDeffinition);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Time, clsTime.GetYMD(new Date()) as unknown as JsonValue);
        ktGrid.setLayerData(InsertPoint, GridLayerData.OldIndex, -1);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Type, enmLayerType.Normal);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Mesh, enmMesh_Number.mhNonMesh);
        ktGrid.setLayerData(InsertPoint, GridLayerData.ReferenceSystem, enmZahyo_System_Info.Zahyo_System_World);
        ktGrid.setLayerData(InsertPoint, GridLayerData.SyntheticObjF, false);
        if(lstMapFile.length > 0){
            ktGrid.setLayerData(InsertPoint, GridLayerData.MapFile, lstMapFile.getAllText()[0]);
        }
        const datan  = ktGrid.getXsize(InsertPoint);
        for(let i  = 0 ;i< datan;i++){
            ktGrid.setFixedYSData(InsertPoint, i, 2,Generic.ConvertMissingValueFromBool(false))
        }
        ktGrid.setLayerData(InsertPoint, GridLayerData.Comment, "");
       set_First_GridCellWidthHeight(InsertPoint);
        ktGrid.setLayer ( InsertPoint);
        Check_DataKind(InsertPoint);
        ktGrid.refresh();
        Set_LayerTypeShape();
        ErrorCheck();
    }
    /**表示レイヤを変更した場合に発生 */
    function Change_LayerSelect(_Layer: number, _PreviousLayer: number) {
        Set_LayerTypeShape();
        ErrorCheck();
    }
    /**上部の固定部分の枠２行目をクリックした場合に発生 */
    function Click_FixedYS2(cbl: number, cbx: number, cby: number, Value: string, Top: number, Left: number, Width: number, Height: number, e: MouseEvent) {
        type PopupMenuItem = { caption: string; value?: AttDataTypeValue };
        switch (cby) {
            case 1: {
                const popmenu = [{ caption: Generic.ConvertAttDataTypeString(enmAttDataType.Normal), value: enmAttDataType.Normal, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.Category), value: enmAttDataType.Category, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.Strings), value: enmAttDataType.Strings, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.URL), value: enmAttDataType.URL, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.URL_Name), value: enmAttDataType.URL_Name, event: dtype }
                ];
                Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
                break;
            }
            case 2: {
                const popmenu = [{ caption: Generic.ConvertMissingValueFromBool(true), event: dMissing },
                    { caption: Generic.ConvertMissingValueFromBool(false),  event: dMissing }
                    ];
                    Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
                break;
            }
        }
        function dMissing(menuItem: PopupMenuItem){
            ktGrid.setFixedYSData(cbl, cbx, cby,menuItem.caption);
            ktGrid.refresh();
        }
        function dtype(menuItem: PopupMenuItem) {
            if (menuItem.value === undefined) {
                return;
            }
            ktGrid.setFixedYSData(cbl, cbx, cby,menuItem.caption);
            const Title = ktGrid.getFixedYSData(cbl, cbx, 3);
            const Unit = ktGrid.getFixedYSData(cbl, cbx, 4);
            const retV = Generic.SetTitleUnit_from_AttDataType(menuItem.value, Title, Unit);
            ktGrid.setFixedYSData(cbl, cbx, 3, retV.title);
            ktGrid.setFixedYSData(cbl, cbx, 4, retV.unit);
            switch (menuItem.value) {
                case enmAttDataType.Normal:
                case enmAttDataType.Lat:
                case enmAttDataType.Lon:
                    ktGrid.setGridAlligntment(cbl, cbx, enmHorizontalAlignment.Right);
                    break;
                default:
                    ktGrid.setGridAlligntment(cbl, cbx, enmHorizontalAlignment.Left);
                    break;
            }
            ktGrid.refresh();
            ErrorCheck();
        }
    }

    /**データ部分をクリックした場合に発生 */
    function Click_DataGrid(_Layer: number, _X: number, _Y: number, _Value: string, _Top: number, _Left: number, _Width: number, _Height: number) {
        // console.log("Click_DataGrid", Layer, X, Y, Value, Top, Left, Width, Height);
    }
    /**上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生 */
    function Change_FixedYS() {
        // console.log("Change_FixedYS");
        check_DataKind_and_Allignment(ktGrid.getLayer());
        ktGrid.refresh()
        ErrorCheck();
    }
    /**左部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生 */
    function Change_FixedXS() {
        // console.log("Change_FixedXS");
        ErrorCheck();
    }
    /** 左上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生*/
    function Change_FixedUpperLeft() {
        // console.log("Change_FixedUpperLeft");
    }
    /**レイヤ名の変更、レイヤの移動などで発生 */
    function Change_Layer(LayerNameChange: boolean, LayerMove: boolean, LayerDelete: boolean) {
        // console.log("Change_Layer", LayerNameChange, LayerMove, LayerDelete);
        if(LayerDelete===true){
            Set_LayerTypeShape();
        }
    }

    /**既存データの編集の場合、グリッド上中のデータと以前のデータを比較 */
    function Check_Data() {
        const R_Conv = [];// Layer_Data_Info())
        // const r_md = 0;
        for (let i = 0; i < oldAttrData.TotalData.LV1.Lay_Maxn; i++) {
            const datan = oldAttrData.LayerData[i].atrData.Count;
            const d = [];
            for (let j = 0; j < datan; j++) {
                d[j] = new Layer_Data_Info();
                d[j].Layer = -1;
                d[j].Data = -1;
            }
            R_Conv.push(d);
        }

        //グリッド上のデータに対応する旧データを設定
        const Conv = Get_Data_Refference();// List(Of Layer_Data_Info()) 
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                const cv = Conv[i][j];
                if (cv.Layer !== -1) {
                    const d = R_Conv[cv.Layer];
                    d[cv.Data].Layer = i;
                    d[cv.Data].Data = j;
                }
            }
        }

        const R_Layer_Convert = new Array(oldAttrData.TotalData.LV1.Lay_Maxn).fill(-1);
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            const L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            if (L !== -1) {
                R_Layer_Convert[L] = i;
            }
        }

        //新しいデータの凡例をD_、D2にセット

        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            const newAL = newAttrData.LayerData[i];
            const L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            const oldAL = oldAttrData.LayerData[L];
            if (L === -1) {
                newAL.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                //新しいレイヤの場合
            } else {
                newAL.Print_Mode_Layer = oldAttrData.LayerData[L].Print_Mode_Layer;
                //グリッドのレイヤに対応する旧レイヤがある場合
                //グラフモードの凡例をもってくる
                switch (newAL.Type) {
                    case enmLayerType.DefPoint:
                        break;
                    case enmLayerType.Mesh:
                        if (newAL.ReferenceSystem === oldAttrData.LayerData[L].ReferenceSystem) {
                            Check_Kencode_XY(i, L);
                        }
                        break;
                    case enmLayerType.Normal:
                        Check_Kencode_XY(i, L);
                        break;
                }

                //.Shape = oldAttr.LayerData[L].Shape
                newAL.LayerModeViewSettings.PointLineShape = oldAL.LayerModeViewSettings.PointLineShape;

                if ((newAL.MapFileName === oldAL.MapFileName) && (newAL.Time.Equals(oldAL.Time))) {
                    newAL.Dummy = Generic.Array2Clone(oldAL.Dummy);
                } else {
                    const dumn = oldAL.Dummy.length;
                    if (dumn > 0) {
                        newAL.Dummy = [];
                        for (let j = 0; j < dumn; j++) {
                            const ocode = newAttrData.Get_ObjectCode_from_ObjName(i, oldAL.Dummy[j].Name);
                            if (ocode !== -1) {
                                const d = new strDummyObjectName_and_Code();
                                d.code = ocode;
                                d.Name = oldAL.Dummy[dumn - 1].Name;
                                newAL.Dummy.push(d);
                            }
                        }
                    }
                }
                if (newAL.MapFileName === oldAL.MapFileName) {
                    newAL.DummyGroup = oldAL.DummyGroup.concat()
                } else {
                    newAL.DummyGroup = [];
                }
                //グラフモードの設定
                const oldALG = oldAL.LayerModeViewSettings.GraphMode;
                const newALG = newAL.LayerModeViewSettings.GraphMode;
                newALG.SelectedIndex = oldALG.SelectedIndex;
                const dsetCount = oldALG.DataSet.length;
                for (let k = 0; k < dsetCount; k++) {
                    const oldALGD = oldALG.DataSet[k];
                    newALG.DataSet[k] = oldALGD.Clone();
                    const newALD = newALG.DataSet[k];
                    newALD.Data = [];
                    let dn = 0;
                    for (let j = 0; j < oldALGD.Data.length; j++) {
                        const a = oldALGD.Data[j].DataNumber;
                        const b = R_Conv[L][a].Data;
                        if (b !== -1) {
                            newALD.Data[dn] = oldALGD.Data[j].Clone();
                            newALD.Data[dn].DataNumber = b;
                            dn++;
                        }
                    }
                }
                //ラベルデータ
                const oldALL = oldAL.LayerModeViewSettings.LabelMode;
                const newALL = newAL.LayerModeViewSettings.LabelMode;
                const lblDatan = oldALL.DataSet.length;
                newALL.DataSet = [];
                for (let k = 0; k < lblDatan; k++) {
                    const oldALGD = oldALL.DataSet[k];
                    newALL.DataSet[k] = oldALGD.Clone()
                    const newALLD = newALL.DataSet[k];
                    newALLD.DataItem = [];
                    for (let j = 0; j < oldALGD.DataItem.length; j++) {
                        const kk = R_Conv[L][oldALGD.DataItem[j]].Data;
                        if (kk !== -1) {
                            newALLD.DataItem.push(kk);
                        }
                    }
                }
            }

            let shapeNoChange = true;
            if (L !== -1) {
                if (newAL.Shape !== oldAL.Shape) {
                    shapeNoChange = false;
                }
            }

            for (let j = 0; j < newAL.atrData.Count; j++) {
                if ((Conv[i][j].Data === -1) || (newAttrData.Get_DataType(i, j) === enmAttDataType.Strings)) {
                    //グリッドのデータに対応する旧データがない場合、または文字モード
                } else {
                    //グリッドのデータに対応する旧データがある場合、
                    //旧データの凡例を持ってくる
                    const DD = Conv[i][j].Data;
                    const dL = Conv[i][j].Layer;

                    const O_Data = oldAttrData.LayerData[dL].atrData.Data[DD];
                    if (newAttrData.Check_Enable_SoloMode(O_Data.ModeData, i, j) === true) {
                        newAL.atrData.Data[j].ModeData = O_Data.ModeData;
                    }

                    newAttrData.Set_Legend(i, j, O_Data, true, shapeNoChange, shapeNoChange, true, shapeNoChange, true, shapeNoChange, true, true, true, (i === dL));

                    if (newAL.MapFileName !== oldAttrData.LayerData[dL].MapFileName) {
                        //地図ファイルが変更された場合に線モードのチェック
                        const newALD = newAL.atrData.Data[j];
                        newALD.SoloModeViewSettings.ClassODMD.O_object = 0;
                        newALD.SoloModeViewSettings.ClassODMD.o_Layer = i;
                        for (let kk = 0; kk < newAttrData.TotalData.LV1.Lay_Maxn; kk++) {
                            for (let k = 0; k < newAttrData.LayerData[kk].atrObject.ObjectNum; k++) {
                                if (newALD.Title.indexOf(newAttrData.Get_KenObjName(kk, k)) !== -1) {
                                    newALD.SoloModeViewSettings.ClassODMD.O_object = k;
                                    newALD.SoloModeViewSettings.ClassODMD.o_Layer = kk;
                                    kk = newAttrData.TotalData.LV1.Lay_Maxn;
                                    break;
                                }
                            }
                        }
                    } else {
                        //地図ファイルが変更されていない場合の線モードのチェック
                        const aOD = O_Data.SoloModeViewSettings.ClassODMD;
                        const odl = aOD.o_Layer;
                        const odo = aOD.O_object;
                        const oob = oldAttrData.Get_KenObjCode(odl, odo); // D_Kencode(odo + D_Layer(odl).Object.Stac).Object.code
                        const newALOD = newAL.atrData.Data[j].SoloModeViewSettings.ClassODMD;
                        if (R_Layer_Convert[odl] !== -1) {
                            newALOD.o_Layer = R_Layer_Convert[odl];
                            newALOD.O_object = 0;
                            if (newALOD.Dummy_ObjectFlag === false) {
                                for (let k = 0; k < newAttrData.Get_ObjectNum(newALOD.o_Layer); k++) {
                                    if (newAttrData.Get_KenObjCode(newALOD.o_Layer, k) === oob) {
                                        newALOD.O_object = k;
                                        break;
                                    }
                                }
                            }
                        } else {
                            newALOD.o_Layer = i;
                            newALOD.O_object = 0;
                        }
                    }
                    //記号の大きさモードの内部塗りつぶしデータ項目のチェック
                    const newALS = newAL.atrData.Data[j].SoloModeViewSettings;
                    const newALSMI = newALS.MarkCommon.Inner_Data;
                    if (L === -1) {
                        newALSMI.Data = j;
                        newALSMI.Flag = false;
                    } else {
                        newALSMI.Data = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data.Data;
                        newALSMI.Flag = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data.Flag;
                        const k = R_Conv[L][newALSMI.Data].Data;
                        if (k === -1) {
                            newALSMI.Data = j;
                            newALSMI.Flag = false;
                        } else {
                            newALSMI.Data = k;
                        }
                    }
                }
            }
        }

        // console.log(newAttrData.LayerData[0].atrData.Data)
        //---------------------線モードのベジェ曲線をチェック
        for(let L  = 0 ;L< oldAttrData.TotalData.LV1.Lay_Maxn ; L++) {
            const oldAL=oldAttrData.LayerData[L];
            if((oldAL.Type === enmLayerType.Normal)||(oldAL.Type === enmLayerType.Mesh )){
                for(let i  = 0 ;i< oldAL.ODBezier_DataStac.length ;i++){
                    const d  = oldAL.ODBezier_DataStac[i].Clone();
                    if(ZahyoOk === true ){
                        const aD  = R_Conv[L][d.Data].Data;
                        const aL  = R_Conv[L][d.Data].Layer;
                        if((aD !== -1)&&(aL !== -1 )){
                            const oldObj  = oldAttrData.Get_KenObjName(L, d.ObjectPos);
                            const newObj  = newAttrData.Search_ObjName(aL, oldObj);
                            if((aD !== -1)&&(aL !== -1)&&(newObj !== -1 )){
                                d.Data = aD;
                                d.ObjectPos = newObj;
                            }
                            newAttrData.LayerData[aL].ODBezier_DataStac.push(d);
                        }
                    }
                }
            }
        }

        //---------------------図形のデータ項目番号をチェック
        // for(let i  = 0 ;i< oldAttr.TotalData.FigureStac.Count ; i++) {
        //     let FigStac As Object = oldAttr.TotalData.FigureStac[i]
        //     let PrintData strFigure_data
        //     switch( true
        //         case TypeOf FigStac Is strFig_Word_Data
        //             let FigData strFig_Word_Data = DirectCast(FigStac, strFig_Word_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Line_Data
        //             let FigData strFig_Line_Data = DirectCast(FigStac, strFig_Line_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Circle_data
        //             let FigData strFig_Circle_data = DirectCast(FigStac, strFig_Circle_data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Point_Data
        //             let FigData strFig_Point_Data = DirectCast(FigStac, strFig_Point_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_gazo_data
        //             let FigData strFig_gazo_data = DirectCast(FigStac, strFig_gazo_data)
        //             PrintData = FigData.Data
        //     }
        //     if(ZahyoOk = true ){
        //         let dl  = PrintData.Layer - 1
        //         let DD  = PrintData.Data - 1
        //         let ddl  = 0
        //         let ddd  = 0
        //         if(dl !== -1 ){
        //             ddl = R_Layer_Convert(dl) + 1
        //             if(DD !== -1 ){
        //                 if(DD = oldAttr.Get_DataNum(dl) + 1 ){
        //                     ddd = newAttrData.Get_DataNum(dl) + 1
        //                 }else{
        //                     ddd = R_Conv(dl)(DD).Data + 1
        //                 }
        //             }
        //         }
        //         PrintData.Layer = ddl
        //         PrintData.Data = ddd
        //         switch( true
        //             case TypeOf FigStac Is strFig_Word_Data
        //                 let FigData strFig_Word_Data = DirectCast(FigStac, strFig_Word_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Line_Data
        //                 let FigData strFig_Line_Data = DirectCast(FigStac, strFig_Line_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Circle_data
        //                 let FigData strFig_Circle_data = DirectCast(FigStac, strFig_Circle_data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Point_Data
        //                 let FigData strFig_Point_Data = DirectCast(FigStac, strFig_Point_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_gazo_data
        //                 let FigData strFig_gazo_data = DirectCast(FigStac, strFig_gazo_data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //         }
        //     }
        // }

        //重ね合わせモードのデータをチェック
        const newATO = newAttrData.TotalData.TotalMode.OverLay;
        const oldATO = oldAttrData.TotalData.TotalMode.OverLay;
        newATO.initDataSet();
        newATO.Always_Overlay_Index = oldATO.Always_Overlay_Index;
        newATO.SelectedIndex = oldATO.SelectedIndex;
        if (oldATO.DataSet.length !== 0) {
            newATO.DataSet = [];
        }

        for (let i = 0; i < oldATO.DataSet.length; i++) {
            const OverDataset = new strOverLay_Dataset_Info();
            OverDataset.initData();
            OverDataset.title = oldATO.DataSet[i].title;
            let f;
            for (let j = 0; j < oldATO.DataSet[i].DataItem.length; j++) {
                const overDt = oldATO.DataSet[i].DataItem[j].Clone();
                f = false;
                switch (overDt.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        const aD = R_Conv[overDt.Layer][overDt.DataNumber].Data;
                        const aL = R_Conv[overDt.Layer][overDt.DataNumber].Layer;
                        if ((aD === -1) || (aL === -1)) {
                            f = false;
                        } else {
                            overDt.DataNumber = aD;
                            overDt.Layer = aL;
                            f = true;
                        }
                        break;
                    }
                    case enmLayerMode_Number.GraphMode:
                    case enmLayerMode_Number.LabelMode: {
                        const aL = R_Layer_Convert[overDt.Layer];
                        if (aL === -1) {
                            f = false;
                        } else {
                            overDt.Layer = aL;
                            f = true;
                        }
                        break;
                    }
                }
                if (f === true) {
                    OverDataset.DataItem.push(overDt);
                }
            }
            newATO.SelectedIndex = Math.min(oldATO.DataSet[i].SelectedIndex, OverDataset.DataItem.length - 1)
            newATO.DataSet.push(OverDataset as unknown as IOverLayDatasetInfo);
        }
        newATO.SelectedIndex = oldATO.SelectedIndex;

        //連続表示モードのデータをチェック
        const newATS = newAttrData.TotalData.TotalMode.Series;
        const oldATS = oldAttrData.TotalData.TotalMode.Series;
        newATS.initDataSet();
        if (oldATS.DataSet.length !== 0) {
            newATS.DataSet = [];
        }
        newATS.SelectedIndex = oldATS.SelectedIndex;
        for(let i  = 0 ;i< oldATS.DataSet.length ; i++) {
            const SeriesDataset = new strSeries_Dataset_Info();
            SeriesDataset.initData()
            SeriesDataset.title = oldATS.DataSet[i].title;
            for (let j = 0; j < oldATS.DataSet[i].DataItem.length; j++) {
                const seriesDt = oldATS.DataSet[i].DataItem[j].Clone();
                let f = false;
                switch (seriesDt.Print_Mode_Total) {
                    case enmTotalMode_Number.DataViewMode: {
                        switch (seriesDt.Print_Mode_Layer) {
                            case enmLayerMode_Number.SoloMode: {
                                const aD = R_Conv[seriesDt.Layer][seriesDt.Data].Data;
                                const aL = R_Conv[seriesDt.Layer][seriesDt.Data].Layer;
                                if ((aD === -1) || (aL === -1)) {
                                    f = false;
                                } else {
                                    seriesDt.Data = aD;
                                    seriesDt.Layer = aL;
                                    f = true;
                                }
                                break;
                            }
                            case enmLayerMode_Number.GraphMode:
                            case enmLayerMode_Number.LabelMode: {
                                const aL = R_Layer_Convert[seriesDt.Layer];
                                if (aL === -1) {
                                    f = false;
                                } else {
                                    seriesDt.Layer = aL;
                                    f = true;
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case enmTotalMode_Number.OverLayMode:
                }
                if (f === true) {
                    SeriesDataset.DataItem.push(seriesDt);
                }
            }
            SeriesDataset.SelectedIndex = Math.min(oldATS.DataSet[i].SelectedIndex, SeriesDataset.DataItem.length - 1);
            newATS.DataSet.push(SeriesDataset as unknown as ISeriesDatasetInfo);
        }
        newATS.SelectedIndex = oldATS.SelectedIndex

        //ProgressLabel.SetValue TotalData.LV1.Lay_Maxn * 2 + 3
        //属性検索データをチェック
        newAttrData.TotalData.Condition =[];// New List(Of strCondition_DataSet_Info)
        for(let i  = 0 ;i< oldAttrData.TotalData.Condition.length ; i++) {
            const oldATC = oldAttrData.TotalData.Condition[i];
            const oldL = oldATC.Layer;
            const L = R_Layer_Convert[oldL];
            //レイヤが削除された場合は属性検索は削除
            if(L !== -1 ){
                const conDataset = new strCondition_DataSet_Info();
                conDataset.Enabled = oldATC.Enabled;
                conDataset.Layer = L;
                conDataset.Name = oldATC.Name;
                conDataset.Condition_Class = []; //New List(Of strCondition_Data_Info)
                for (let j = 0; j < oldATC.Condition_Class.length; j++) {
                    const dt = new strCondition_Data_Info();
                    const oldATCC = oldATC.Condition_Class[j];
                    dt.And_OR = oldATCC.And_OR
                    dt.Condition = [];// New List(Of strCondition_Limitation_Info)
                    for (let k = 0; k < oldATCC.Condition.Count; k++) {
                        const dtItem = oldATCC.Condition[k].Clone();
                        const D = R_Conv[oldL][dtItem.Data].Data;
                        if (D !== -1) {
                            dtItem.Data = D;
                            dt.Condition.push(dtItem);
                        }
                    }
                    //データが無くなった場合でも、コレクションは残す
                    conDataset.Condition_Class.push(dt);
                }
                newAttrData.TotalData.Condition.push(conDataset);
            }
        }

        //選択するデータ項目をチェックする
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            const L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            let d = 0;
            if (L !== -1) {
                d = R_Conv[L][oldAttrData.LayerData[L].atrData.SelectedIndex].Data;
                if (d === -1) {
                    d = 0;
                }
            }
            newAttrData.LayerData[i].atrData.SelectedIndex = d;
        }

        //選択するレイヤをチェックする
        const Layn  = R_Layer_Convert[oldAttrData.TotalData.LV1.SelectedLayer];
        if(Layn === -1 ){
            newAttrData.TotalData.LV1.SelectedLayer = 0;
        }else{
            newAttrData.TotalData.LV1.SelectedLayer = Layn;
        }
        newAttrData.TotalData.LV1.Print_Mode_Total = oldAttrData.TotalData.LV1.Print_Mode_Total;

    }

    /**古いシンボル位置・ラベル位置で変更してあるものがあったら新しい箇所にコピーする */
    function Check_Kencode_XY(NewL: number, OldL: number){
        const newAL = newAttrData.LayerData[NewL];
        const oldAL = oldAttrData.LayerData[OldL];
        const time = newAL.Time;
        if (newAL.Type === enmLayerType.Normal) {
            if (newAL.MapFileName !== oldAL.MapFileName) {
                for (let i = 0; i < newAL.atrObject.ObjectNum; i++) {
                    const newALA = newAL.atrObject.atrObjectData[i];
                    newALA.CenterPoint = newAL.MapFileData.Get_Enable_CenterP(newALA.MpObjCode, time);
                    newALA.Symbol = newALA.CenterPoint.Clone();
                    newALA.Label = newALA.CenterPoint.Clone();
                    newALA.Visible = true;
                }
                return;
            }
        }

        const oldObjn = oldAttrData.Get_ObjectNum(OldL);
        const sortoldObjName = new SortingSearch();
        for (let i = 0; i < oldObjn; i++) {
            sortoldObjName.Add(oldAttrData.Get_KenObjName(OldL, i));
        }
        sortoldObjName.AddEnd();

        for (let i = 0; i < newAttrData.Get_ObjectNum(NewL); i++) {
            const objName = newAttrData.Get_KenObjName(NewL, i);
            const oldN = sortoldObjName.SearchData_One(objName);
            const naa = newAL.atrObject.atrObjectData[i];
            const oldALA = oldAL.atrObject.atrObjectData[oldN];
            switch (newAL.Type) {
                case enmLayerType.Normal: {
                    if ((oldN === -1) || (ZahyoOk === false)) {
                        naa.CenterPoint = newAL.MapFileData.Get_Enable_CenterP(naa.MpObjCode, time);
                        naa.Symbol = naa.CenterPoint.Clone();
                        naa.Label = naa.CenterPoint.Clone();
                        naa.Visible = true;
                    } else {
                        naa.CenterPoint = oldALA.CenterPoint.Clone();
                        naa.Symbol = oldALA.Symbol.Clone();
                        naa.Label = oldALA.Label.Clone();
                        naa.Visible = oldALA.Visible;
                    }
                    break;
                }
                case enmLayerType.Mesh: {
                    if ((oldN === -1) || (ZahyoOk === false)) {
                        // データなしまたは座標不正の場合は処理をスキップ
                    } else {
                        naa.CenterPoint = oldALA.CenterPoint.Clone();
                        naa.Symbol = oldALA.Symbol.Clone();
                        naa.Label = oldALA.Label.Clone();
                        naa.MeshRect = oldALA.MeshRect.Clone();
                        naa.MeshPoint = Generic.ArrayClone(oldALA.MeshPoint);
                        naa.Visible = oldALA.Visible;
                    }
                    break;
                }
                case enmLayerType.DefPoint: {
                    if ((oldN === -1) || (ZahyoOk === false)) {
                        // データなしまたは座標不正の場合は処理をスキップ
                    } else {
                        if (naa.defPoint.Equals(oldALA.defPoint)) {
                            naa.CenterPoint = oldALA.CenterPoint.Clone();
                            naa.Symbol = oldALA.Symbol.Clone();
                            naa.Label = oldALA.Label.Clone();
                            naa.Visible = oldALA.Visible;
                        }
                    }
                    break;
                }
            }
        }
    }

    /**グリッド上のデータに対応する旧データを設定 */
    function  Get_Data_Refference(){
        const D_LayerNum = oldAttrData.TotalData.LV1.Lay_Maxn;

        const CheckedData=[]// As New List(Of Boolean())
        for(let i  = 0 ;i< D_LayerNum  ;i++){
            const d=new Array(oldAttrData.LayerData[i].atrData.Count) ;
            CheckedData.push(d);
        }

        const Conv = [];//As New List(Of Layer_Data_Info())
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            const Dconv = [];//(datn - 1) As Layer_Data_Info
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                Dconv[j] = Check_Data2(i, j, 1, CheckedData);
            }
            Conv.push(Dconv);
        }
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                if (Conv[i][j].Layer === -1) {
                    Conv[i][j] = Check_Data2(i, j, 2, CheckedData);
                }
            }
        }
        return Conv;
    }

    /**平均値・合計値などがグリッド上のデータと同じ旧データを探す */
    function Check_Data2(L: number, D: number, CheckLevel: number, CheckedData: boolean[][]){

        const CheckDataRet = new Layer_Data_Info();
        const G_DTA = newAttrData.LayerData[L].atrData.Data[D];
   
        const Old_Lay = ktGrid.getLayerData(L, GridLayerData.OldIndex);
        if (Old_Lay === -1) {
            CheckDataRet.Layer = -1;
            CheckDataRet.Data = -1;
            return CheckDataRet;
        }

        //同一名称・単位のデータ項目をチェック
        const KouhoTitle = [];// As New List(Of Layer_Data_Info)
        for (let i = 0; i < oldAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < oldAttrData.LayerData[i].atrData.Count; j++) {
                const O_DTA = oldAttrData.LayerData[i].atrData.Data[j];
                if ((O_DTA.Title === G_DTA.Title) && (O_DTA.Unit === G_DTA.Unit)) {
                    const dt = new Layer_Data_Info();
                    dt.Layer = i;
                    dt.Data = j;
                    KouhoTitle.push(dt);
                }
            }
        }
        if (KouhoTitle.length >= 1) {
            let j = 0;
            let n = 0;
            for (let i = 0; i < KouhoTitle.length; i++) {
                if (Old_Lay === KouhoTitle[i].Layer) {
                    n = i;
                    j++;
                }
            }
            if (j === 1) {
                //過去同一レイヤだった候補が１つある場合は確定
                const BeL = KouhoTitle[n].Layer;
                const BeD = KouhoTitle[n].Data;
                CheckDataRet.Layer = BeL;
                CheckDataRet.Data = BeD;
                CheckedData[BeL][BeD] = true;
                return CheckDataRet
            }
        }
        if (CheckLevel === 1) {
            CheckDataRet.Layer = -1;
            CheckDataRet.Data = -1;
            return CheckDataRet;
        }

        const Data_Prop_Value = Get_Data_Property_Value(newAttrData, L, D);

        const Kouho = [];// New List(Of Layer_Data_InfoCheck)
        const Sort_KouhoV = new SortingSearch()

        for (let i = 0; i < oldAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < oldAttrData.LayerData[i].atrData.Count; j++) {
                const O_DTA = oldAttrData.LayerData[i].atrData.Data[j]
                if (O_DTA.DataType === G_DTA.DataType) {
                    let OV = D_CheckDataValue[i][j];
                    let GV = Data_Prop_Value;
                    if (GV === 0) {
                        GV++;
                        OV++;
                    }
                    const av = Math.abs(OV / GV - 1);
                    if (av <= 0.3) {
                        const dt = new Layer_Data_InfoCheck();
                        dt.Layer = i;//レイヤ
                        dt.Data = j; //データ項目
                        dt.Value = av;
                        Kouho.push(dt);
                    }
                }
            }
        } 
        let BL;
        let BD;
        switch (Kouho.length) {
            case 0:
                BL = -1;
                BD = -1;
                break;
            case 1:
                BL = Kouho[0].Layer;
                BD = Kouho[0].Data;
                break;
            default: {
                BD = -1;
                BL = -1;
                let i2 = 0;
                for (let i = 0; i < Kouho.length; i++) {
                    Sort_KouhoV.Add(Kouho[i].Value);
                }
                Sort_KouhoV.AddEnd();
                do {
                    i2++;
                    if (i2 === Kouho.length) {
                        break;
                    }
                } while (Sort_KouhoV.DataPositionValue(i2) === Sort_KouhoV.DataPositionValue(0));

                if (i2 === 1) {
                    BL = Kouho[Sort_KouhoV.DataPosition(0)].Layer;
                    BD = Kouho[Sort_KouhoV.DataPosition(0)].Data;
                } else {
                        for(let j  = 0 ;j<  i2 ;j++){
                            const kj=Kouho[j];
                            const O_DTA = oldAttrData.LayerData[kj.Layer].atrData.Data[kj.Data];
                            if((O_DTA.Title === G_DTA.Title)&&(O_DTA.Unit === G_DTA.Unit) ){
                                BL = kj.Layer;
                                BD = kj.Data;
                                break;
                            }
                        }
                        if(BD === -1 ){
                                BL = Kouho[Sort_KouhoV.DataPosition(0)].Layer;
                                BD =Kouho[Sort_KouhoV.DataPosition(0)] .Data;
                        }
                        break;
                    }
            }
            if(BL !== -1 ){
                if(CheckedData[BL][BD]  === true ){
                    BD = -1;
                    BL = -1;
                }else{
                    CheckedData[BL][BD] = true;
                }
            }
            CheckDataRet.Layer = BL;
            CheckDataRet.Data = BD;
            return CheckDataRet
    }

    Reset_SCRView_Size = function(){

        newAttrData.Check_Vector_Object();
        //ダミー点オブジェクトの記号
        newAttrData.initDummuyPointObjectMark();
        const newTV = newAttrData.TotalData.ViewStyle;
        const oldTV = oldAttrData.TotalData.ViewStyle;
        const oldDummy = oldTV.DummyObjectPointMark;
        if (Object.keys(newTV.DummyObjectPointMark).length > 0) {
            const newMapfile = newAttrData.GetMapFileName();
            const oldMapfile = oldAttrData.GetMapFileName();
            for (let i = 0; i < newMapfile.length; i++) {
                const n = oldMapfile.indexOf(newMapfile[i]);
                if (n !== -1) {
                    if (newTV.DummyObjectPointMark[newMapfile[i]]) {
                        const d = newTV.DummyObjectPointMark[newMapfile[i]];
                        const oldD = oldDummy[newMapfile[i]];
                        for (let j = 0; j < d.length; j++) {
                            d[j].ObjectKindName = oldD[j].ObjectKindName;
                            d[j].Mark = oldD[j].Mark.Clone();
                        }
                    }
                }
            }
        }

        const oldTTS  = oldTV.ScrData;
        const newTTS=newTV.ScrData;
        if(oldTTS.MapRectangle.Equals(newTTS.MapRectangle) === true ){
            newTTS.ScrData = oldTTS.Clone();
            //地図領域が同じ場合はここまで
            return;
        }

        if(ZahyoOk === false ){
            newTTS.ScrView = newTTS.MapRectangle.Clone();
        }else{
            const newTTSV = newTTS.ScrView;
            const O_SCRView = oldTTS.ScrView;
            const OP1 = O_SCRView.topLeft();
            const OP2 = O_SCRView.bottomRight();
            if (OP1.x < newTTSV.left) {
                OP1.x = newTTSV.left;
            }
            if (OP2.x > newTTSV.right) {
                OP2.x = newTTSV.right;
            }
            if (OP1.y < newTTSV.top) {
                OP1.y = newTTSV.top;
            }
            if (OP2.y > newTTSV.bottom) {
                OP2.y = newTTSV.bottom;
            }
            if (OP2.x - OP1.x <= 0) {
                OP2.x = newTTSV.right;
                OP1.x = newTTSV.left;
            }
            if (OP2.y - OP1.y <= 0) {
                OP1.y = newTTSV.top;
                OP2.y = newTTSV.bottom;
            }
            newTTS.ScrView = new rectangle(OP1.x, OP2.x,OP1.y,  OP2.y);

            if(newTTS.Accessory_Base === enmBasePosition.Map ){
                const MapRect = newTTS.MapRectangle;
                const WAKU = newTTS.MapRectangle.Clone();
                const sz = newTTS.MapRectangle.size();
                 WAKU.inflate(sz.width * 0.1, sz.height * 0.1);
                const mlb = newTV.MapLegend.Base;
                for (let i = 0; i < mlb.Legend_Num; i++) {
                    if ((mlb.LegendXY[i].x < WAKU.left) || (mlb.LegendXY[i].x > WAKU.right) || (
                        mlb.LegendXY[i].y < WAKU.top) || (mlb.LegendXY[i].y > WAKU.bottom)) {
                        mlb.LegendXY[i].x = MapRect.right + (1 - i) * (WAKU.width as number) / 50;
                        mlb.LegendXY[i].y = (MapRect.top + MapRect.bottom) / 2 + (1 - i) * (sz.height as number) / 50; // + wy2) / 2 + (1 - i) * h / 50
                    }
                }

                const mlt = newTV.MapTitle.Position;
                if ((mlt.x < WAKU.left) || (mlt.x > WAKU.right) || (
                    mlt.y < WAKU.top) || (mlt.y > WAKU.bottom)) {
                    mlt.x = (MapRect.left + MapRect.right) / 2;
                    mlt.y = MapRect.bottom + sz.height / 20;
                }
                const mls = newTV.MapScale.Position;
                if ((mls.x < WAKU.left) || (mls.x > WAKU.right) || (
                    mls.y < WAKU.top) || (mls.y > WAKU.bottom)) {
                    mls.x = MapRect.left + sz.width * 4 / 5;
                    mls.y = MapRect.bottom + sz.height / 30;
                }
                const mlc = newTV.AttMapCompass.Position
                if ((mlc.x < WAKU.left) || (mlc.x > WAKU.right) || (
                    mlc.y < WAKU.top) || (mlc.y > WAKU.bottom)) {
                    if (mlc.x >= MapRect.right + sz.width * 0.3) { mlc.x = MapRect.right - sz.width * 0.1 }
                    if (mlc.x <= MapRect.left - sz.width * 0.3) { mlc.x = MapRect.left + sz.width * 0.1 }
                    if (mlc.y >= MapRect.bottom + sz.height * 0.3) { mlc.y = MapRect.bottom - sz.height * 0.1 }
                    if (mlc.y <= MapRect.top - sz.height * 0.3) { mlc.y = MapRect.top + sz.height * 0.1 }
                }
            }
        }
    }

    /**グリッド上のデータを取得 */
    Get_E_Data = function(){
        const L = ktGrid.getLayerMax();
        newAttrData.TotalData.LV1.Lay_Maxn = 0
        for (let i = 0; i < L; i++) {
            const LayYMax = ktGrid.getYsize(i);
            const LayXMax = ktGrid.getXsize(i);
            const YChange = new Array(LayYMax - 1);
            let LayYMaxReal = 0;
            for (let j = 0; j < LayYMax; j++) {
                if (ktGrid.getFixedXSData(i, 1, j) === "") {
                    YChange[j] = -1;
                } else {
                    YChange[j] = LayYMaxReal;
                    LayYMaxReal++;
                }
            }
            const LType = ktGrid.getLayerData(i, GridLayerData.Type);
            const LSP = ktGrid.getLayerData(i, GridLayerData.Shape);
            const Lmesh = ktGrid.getLayerData(i, GridLayerData.Mesh);
            const Lmapfile = ktGrid.getLayerData(i, GridLayerData.MapFile);
            const LTime = ktGrid.getLayerData(i, GridLayerData.Time);
            const OldLay = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            const SyntheticObjF = ktGrid.getLayerData(i, GridLayerData.SyntheticObjF);
            const RefSystem = ktGrid.getLayerData(i, GridLayerData.ReferenceSystem);
            const LayComment = ktGrid.getLayerData(i, GridLayerData.Comment);

            const Get_Obj = new Array(LayYMaxReal);
            for (let i = 0; i < LayYMaxReal; i++) {
                Get_Obj[i] = new strObject_Data_Info();
            }
            if (SyntheticObjF === true) {
                //時系列集計したレイヤの場合は，変更前のオブジェクトコード・合成オブジェクトデータを設定する

                for (let j = 0; j < oldAttrData.LayerData[OldLay].atrObject.ObjectNum; j++) {
                    const gob = Get_Obj[j];
                    gob.Objectstructure = oldAttrData.LayerData[OldLay].atrObject.atrObjectData[j].Objectstructure;
                    gob.MpObjCode = oldAttrData.LayerData[OldLay].atrObject.atrObjectData[j].MpObjCode;
                    gob.Name = oldAttrData.LayerData[OldLay].atrObject.atrObjectData[j].Name;
                }
            } else {
                for (let j = 0; j < LayYMax; j++) {
                    if (YChange[j] !== -1) {
                        const tx = ktGrid.getFixedXSData(i, 1, j);
                        const UseMap = newAttrData.SetMapFile(Lmapfile);
                        const gobj = Get_Obj[YChange[j]];
                        switch (LType) {
                            case enmLayerType.Mesh:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                gobj.MpObjCode = -2;
                                break;
                            case enmLayerType.Normal:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                gobj.MpObjCode = newAttrData.Get_ObjectCode_from_ObjName(Lmapfile, tx, LTime);
                                gobj.CenterPoint = UseMap.Get_Enable_CenterP(gobj.MpObjCode, LTime);
                                gobj.Symbol = gobj.CenterPoint.Clone();
                                gobj.Label = gobj.CenterPoint.Clone();
                                break;
                            case enmLayerType.DefPoint:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                break;
                        }
                    }
                }
            }
            newAttrData.Add_one_Layer(ktGrid.getLayerName(i), LType, Lmesh, LSP, Lmapfile, LTime, RefSystem, LayComment, LayYMaxReal, Get_Obj);

            const newAt = newAttrData.LayerData[i];
            newAt.Type = LType;
            if (SyntheticObjF === true) {
                const n = oldAttrData.LayerData[OldLay].atrObject.NumOfSyntheticObj;
                newAt.atrObject.NumOfSyntheticObj = n;
                newAt.atrObject.MPSyntheticObj = [];
                for (let j = 0; j < n; j++) {
                    newAt.atrObject.MPSyntheticObj.push(oldAttrData.LayerData[OldLay].atrObject.MPSyntheticObj[j].Clone());
                }
                newAt.Shape = oldAttrData.LayerData[OldLay].Shape;
            } else {
                if (LSP === enmShape.NotDeffinition) {
                    newAt.Shape = newAttrData.Check_LayerShape_Sub(i).shape;
                } else {
                    newAt.Shape = LSP;
                }
            }
            const DN_Str = Generic.Array2Dimension(LayXMax, LayYMax);
            const TTL = [];
            const UNT = [];
            const Mis = [];
            const Note = [];
            for (let j = 0; j < LayXMax; j++) {
                TTL[j] = ktGrid.getFixedYSData(i, j, 3);
                UNT[j] = ktGrid.getFixedYSData(i, j, 4);
                Mis[j] = Generic.ConvertMissingValueFromString(ktGrid.getFixedYSData(i, j, 2));
                Note[j] = ktGrid.getFixedYSData(i, j, 5);
            }
            for (let j = 0; j < LayYMax; j++) {
                if (YChange[j] !== -1) {
                    for (let k = 0; k < LayXMax; k++) {
                        DN_Str[k][YChange[j]] = ktGrid.getGridData(i, k, j);
                    }
                }
            }
            const retv=newAttrData.Set_STRData_To_Cell(i, LayXMax, TTL, UNT, Mis, Note, DN_Str);
            if(retv.ok===false){
                return retv;
            }
            switch (newAt.Type) {
                case enmLayerType.Normal:
                case enmLayerType.Mesh:
                    newAt.LayerModeViewSettings.GraphMode.initDataSet()
                    newAt.LayerModeViewSettings.LabelMode.initDataSet()
                    break;
            }
        }
        return {ok:true};
    }

    /**データエラーのチェック */
    ErrorCheck = function() {
        errorInfo.value="";
        const emes = ErrorCheckLayerMapFile();
        if (emes.length !== 0) {
            let tx = "";
            for (const i in emes) {
                tx += emes[i] + "\n";
            }
            errorInfo.value = tx;
            return true;
        }
        let tx2 = "";
        for (let i = 0; i < ktGrid.getLayerMax(); i++) {
            const mes = Check_ObjectNameLayer(i);
            for (const i in mes) {
                tx2 += mes[i] + "\n";
            }
        }
        if (tx2 !== "") {
            errorInfo.value = tx2;
            return true;
        }
        return false;
    }

    /**レイヤ全体にかかわる項目エラーのチェック */
    function ErrorCheckLayerMapFile() {
        const eMes = [];
        if (newAttrData.GetNumOfMapFile() === 0) {
            eMes.push("地図ファイルが指定されていません。");
            return eMes;
        }
        const mfileList = newAttrData.GetMapFileName();
        for (let i = 0; i < ktGrid.getLayerMax(); i++) {
            const laytype = ktGrid.getLayerData(i, GridLayerData.Type);
            const mpFileName = ktGrid.getLayerData(i, GridLayerData.MapFile);
            const mpFile = newAttrData.SetMapFile(mpFileName);
            const mpn = mfileList.indexOf(mpFileName.toUpperCase());
            if (mpn !== -1) {
                mfileList[mpn] = "";
            }
            const layName = ktGrid.getLayerName(i);
            let kk = 0;
            const FYGrid = ktGrid.getFixedYSData(i);
            let LatN = 0
            let LonN = 0

            for (let j = 0; j < ktGrid.getXsize(i); j++) {
                let f;
                const ttl = FYGrid[j][3].toUpperCase();
                if ((ttl !== "URL") && (ttl !== "URL_NAME")) {
                    if (FYGrid[j][3] === "") {
                        f = false;
                        for (let jj = 0; jj < ktGrid.getYsize(i); jj++) {
                            if (ktGrid.getGridData(i, j, jj) !== "") {
                                f = true;
                                break;
                            }
                        }
                    } else {
                        f = true;
                    }
                    switch (ttl) {
                        case "LAT":
                            LatN++;
                            break;
                        case "LON":
                            LonN++;
                            break;
                    }
                }
                if (f === true) {
                    kk++;
                }
            }
            if (kk === 0) {
                eMes.push(layName + "：データ項目がありません。");
            }

            const L_Time = ktGrid.getLayerData(i, GridLayerData.Time);
            const zahyo = mpFile.Map.Zahyo.Mode
            if ((mpFile.Map.Time_Mode === true) && (L_Time.nullFlag() === true)) {
                eMes.push(layName + "：時期設定が必要です。");
            }
            switch (laytype) {
                case enmLayerType.DefPoint: {
                    if (LatN === 0) {
                        eMes.push(layName + "：地点定義レイヤではLATタグで地点の緯度を指定して下さい。");
                    } else if (LatN >= 2) {
                        eMes.push(layName + "：地点定義レイヤではLATタグを複数箇所で指定しないで下さい。");
                    }
                    if (LonN === 0) {
                        eMes.push(layName + "：地点定義レイヤではLONタグで地点の経度を指定して下さい。");
                    } else if (LonN >= 2) {
                        eMes.push(layName + "：地点定義レイヤではLONタグを複数箇所で指定しないで下さい。");
                    }
                    if (zahyo === enmZahyo_mode_info.Zahyo_No_Mode) {
                        eMes.push(layName + "：緯度経度座標系の地図ファイルでないので地点定義レイヤには設定できません。");
                    }
                    break;
                }
                case enmLayerType.Mesh:
                    if (zahyo === enmZahyo_mode_info.Zahyo_No_Mode) {
                        eMes.push(layName + "：緯度経度座標系の地図ファイルでないのでメッシュレイヤには設定できません。");
                    }
                    break;
            }
        }
        for (let i = 0; i < mfileList.length; i++) {
            if (mfileList[i] !== "") {
                eMes.push("地図ファイル" + mfileList[i] + "は使われていません。");
            }
        }
        return eMes;
    }

    /**レイヤごとのオブジェクト名をチェックする */
    function Check_ObjectNameLayer(LayerNum: number){
        const eMes=[];
        let Enable_Obj  = 0;

        const L_Name  = ktGrid.getLayerName(LayerNum);
        const LayerType  = ktGrid.getLayerData(LayerNum, GridLayerData.Type);
        const SyntheticObjF  = ktGrid.getLayerData(LayerNum, GridLayerData.SyntheticObjF);
        const mpFileName = ktGrid.getLayerData(LayerNum, GridLayerData.MapFile);
        const mpFile = newAttrData.SetMapFile(mpFileName);

        if (SyntheticObjF === false) {
            let L_Time;
            const LAY_Time = true;
            if (LayerType === enmLayerType.Trip_Definition) {
                L_Time = clsTime.GetNullYMD();
            } else if (mpFile.Map.Time_Mode === false) {
                L_Time = clsTime.GetNullYMD()
            } else {
                L_Time = ktGrid.getLayerData(LayerNum, GridLayerData.Time);
            }
            let MeshCodeLen = 0;
            if (LayerType === enmLayerType.Mesh) {
                MeshCodeLen = Generic.getMeshCodeLength(ktGrid.getLayerData(LayerNum, GridLayerData.Mesh));
            }

            const Object_Use_Check = [];
            const FXGrid = ktGrid.getFixedXSData(LayerNum);
            const SH = new Array(4);
            SH.fill(0);
            for (let j = 0; j < ktGrid.getYsize(LayerNum); j++) {
                const ObjName = FXGrid[1][j];
                if (ObjName !== "") {
                    switch (LayerType) {
                        case enmLayerType.Normal: {
                            const code = newAttrData.Get_ObjectCode_from_ObjName(mpFileName, ObjName, L_Time);
                            if (code === -1) {
                                let em2 = ""
                                for (let k = 0; k < mpFile.Map.Kend; k++) {
                                    for (let k2 = 0; k2 < mpFile.MPObj[k].NumOfNameTime; k2++) {
                                        const mnt = mpFile.MPObj[k].NameTimeSTC[k2];
                                        if (mnt.NamesList.indexOf(ObjName) !== -1) {
                                            em2 += Generic.getTimeList(mpFile.MPObj[k].NameTimeSTC[k2]) + "\n";
                                        }
                                    }
                                }
                                if (em2 !== "") {
                                    if (LAY_Time === true) {
                                        eMes.push(L_Name + "：「" + ObjName + "」は時期が違っています。正しい有効期間は\n" + em2 + "です。");
                                    }
                                } else {
                                    eMes.push(L_Name + "：「" + ObjName + "」は地図ファイル中に存在しません。");
                                }
                            } else {
                                if (Object_Use_Check[code] === true) {
                                    eMes.push(L_Name + "：「" + ObjName + "」は複数回使用されています。");
                                } else {
                                    Object_Use_Check[code] = true;
                                    SH[mpFile.MPObj[code].Shape]++;
                                    Enable_Obj++;
                                }
                            }
                            break;
                        }
                        case enmLayerType.Mesh: {
                            if (ObjName.length !== MeshCodeLen) {
                                eMes.push(L_Name + "：「" + ObjName + "」はメッシュサイズが設定と異なります。");
                            } else {
                                Enable_Obj++;
                            }
                            break;
                        }
                        case enmLayerType.DefPoint:
                            Enable_Obj++;
                            break;
                    }
                }
            }
            if (Enable_Obj === 0) {
                eMes.push(L_Name + "：有効なオブジェクトがありません。");
            } else {
                if (LayerType === enmLayerType.Normal) {
                    const enableShale = Generic.checkShape(SH);
                    const LayShape = ktGrid.getLayerData(LayerNum, GridLayerData.Shape);
                    switch (LayShape) {
                        case enmShape.PolygonShape:
                            if (enableShale !== enmShape.PolygonShape) {
                                eMes.push(L_Name + "：面形状に設定できません。");
                            }
                            break;
                        case enmShape.LineShape:
                            if (enableShale === enmShape.PointShape) {
                                eMes.push(L_Name + "：線形状に設定できません。");
                            }
                            break;
                    }
                }
            }
        }
        return eMes;
    }

    /**レイヤ情報の画面セット */
    Set_LayerTypeShape = function(){
        cboLayerMapFile.disabled= true;
        cboLayerType.disabled=true;
        cboLayerShape.disabled= true;
        cboMesh.disabled=true;
        DateTimePickerLayer.disabled = true;
        zahyoSystemFrame.setVisibility(false);
        if (newAttrData.GetNumOfMapFile === 0) {
            return;
        }
        const LayerNum  = ktGrid.getLayer();
        const layMap  = ktGrid.getLayerData(LayerNum, GridLayerData.MapFile);
        cboLayerMapFile.setSelectText(layMap);
        const LayType  = ktGrid.getLayerData(LayerNum, GridLayerData.Type);
        const LayShape  = ktGrid.getLayerData(LayerNum, GridLayerData.Shape);
        const MeshType  = ktGrid.getLayerData(LayerNum, GridLayerData.Mesh);
        const ReferenceSystm  = ktGrid.getLayerData(LayerNum, GridLayerData.ReferenceSystem);
        cboLayerType.setSelectValue(LayType);
        cboLayerShape.setSelectValue(LayShape);
        cboMesh.setSelectValue(MeshType);
        Generic.checkRadioByValue("zahyoSystem",ReferenceSystm);
        const T  = ktGrid.getLayerData(LayerNum, GridLayerData.Time);
        if(T.nullFlag()===false ){
            DateTimePickerLayer.value = T.toInputDate();
            DateTimePickerLayer.disabled=false;
        }
        cboLayerType.disabled=false;
        const SymtheF  = ktGrid.getLayerData(LayerNum, GridLayerData.SyntheticObjF);
        if(SymtheF === true ){
            cboLayerMapFile.disabled= true;
            cboLayerShape.disabled= false;
            cboLayerType.disabled=true;
            cboMesh.disabled=true;
            DateTimePickerLayer.disabled=true;
        }else{
            cboLayerMapFile.disabled= false;
            switch (LayType) {
                case enmLayerType.Normal:
                    cboLayerMapFile.disabled= false;
                    cboLayerShape.disabled= false;
                    break;
                case enmLayerType.DefPoint:
                    cboLayerMapFile.disabled= false;
                    zahyoSystemFrame.setVisibility(true);
                    break;
                case enmLayerType.Mesh:
                    cboLayerMapFile.disabled= false;
                    cboLayerShape.disabled= false;
                    cboMesh.disabled=false;
                    zahyoSystemFrame.setVisibility(true);
                    break;
            }
        }
        txtLayerComment.value = ktGrid.getLayerData(LayerNum, GridLayerData.Comment);
}
    Check_DataKind = function(Layernum: number){
        for (let i = 0; i < ktGrid.getXsize(Layernum); i++) {
            const lType = ktGrid.getLayerData(Layernum, GridLayerData.Type);
            let ttl = "通常のデータ";
            const titleCell = String(ktGrid.getFixedYSData(Layernum, i, 3)).toUpperCase();
            const unitCell = String(ktGrid.getFixedYSData(Layernum, i, 4)).toUpperCase();

            if (titleCell === "URL_NAME") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.URL_Name);
            } else if (titleCell === "URL") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.URL);
            } else if (unitCell === "CAT") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Category);
            } else if (unitCell === "STR") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Strings);
            } else {
                switch (lType) {
                    case enmLayerType.DefPoint: {
                        switch (titleCell) {
                            case "LON":
                                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Lon);
                                break;
                            case "LAT":
                                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Lat);
                                break;
                        }
                        break;
                    }
                }
            }
            ktGrid.setFixedYSData(Layernum, i, 1, ttl);
        }
}
    set_First_GridCellWidthHeight = function(Layernum: number){
       ktGrid.setFixedXSWidth(Layernum, 0,50);
       ktGrid.setFixedXSWidth(Layernum, 1,150);
       ktGrid.setFixedYSHeight(Layernum, 3,38);
       ktGrid.setFixedUpperLeftData(Layernum, 1, 1,"データの種類");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 2,"空白セル");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 3,"タイトル");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 4,"単位");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 5,"注");
    }
    Get_Data_Property_Value = function(_attrData: clsAttrData, Layernum: number, DataNum: number){
        const al = _attrData.LayerData[Layernum];
        switch (al.atrData.Data[DataNum].DataType) {
            case enmAttDataType.Normal:
                //平均値
                return al.atrData.Data[DataNum].Statistics.Ave;
                break;
            case enmAttDataType.Category: {
                let n = 0;
                const retV=_attrData.Get_ClassFrequency(Layernum, DataNum, false);
                const freq=retV.frequency;
                for (let i = 0; i < freq.length; i++) {
                    n += freq[i];
                }
                //度数分布の平均
                return n / freq.length;
                break;
            }
            case enmAttDataType.Strings: {
                let n = 0;
                for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                    n += _attrData.Get_Data_Value(Layernum, DataNum, i, "").length;
                }
                //文字列の長さの平均値
                return n / al.atrObject.ObjectNum;
            }
        }
    }

    check_DataKind_and_Allignment = function(Layernum: number){
        for(let i  = 0 ;i< ktGrid.getXsize(Layernum);i++){
            const dtype  = Generic.getAttDataType_From_TitleUnit(ktGrid.getFixedYSData(Layernum, i, 3), ktGrid.getFixedYSData(Layernum, i, 4));
            ktGrid.setFixedYSData(Layernum, i, 1, Generic.ConvertAttDataTypeString(dtype));
            switch( dtype){
                case enmAttDataType.Normal:
                case enmAttDataType.Lat:
                case  enmAttDataType.Lon:
                    ktGrid.setGridAlligntment(Layernum, i, enmHorizontalAlignment.Right);
                    break;
                default:
                    ktGrid.setGridAlligntment(Layernum, i, enmHorizontalAlignment.Left);
                    break;
                }
            }
    }

    SetMapFileList_to_CboBox = function(){
        const Mapfiles=newAttrData.GetMapFileName();
        if(Mapfiles.length===0){return;}
        const lst=[];
        for(const i in Mapfiles){
            lst.push({text:Mapfiles[i],value:i});
        }
        cboLayerMapFile.addSelectList(lst,undefined,true,false);

    }
    setIniform = function() {
        const gl = GridLayerData;
        gl.MapFile = "MapFile";
        gl.Type = "Type";
        gl.Shape = "Shape";
        gl.Time = "Time";
        gl.OldIndex = "OldIndex";
        gl.Mesh = "Mesh";
        gl.SyntheticObjF = "SyntheticObjF";
        gl.Comment = "Comment";
        gl.ReferenceSystem = "ReferenceSystem";
        // _Change_Data = false; // constなので代入不可
        const ltype = [{ value: enmLayerType.Normal, text: Generic.ConvertStringFromLayerType(enmLayerType.Normal) },
        { value: enmLayerType.DefPoint, text: Generic.ConvertStringFromLayerType(enmLayerType.DefPoint) },
        { value: enmLayerType.Mesh, text: Generic.ConvertStringFromLayerType(enmLayerType.Mesh) }];
        cboLayerType.addSelectList(ltype, 0, false, false)
        const lShape = [{ value: enmShape.NotDeffinition, text: Generic.ConvertShapeEnumString(enmShape.NotDeffinition) },
        { value: enmShape.PointShape, text: Generic.ConvertShapeEnumString(enmShape.PointShape) },
        { value: enmShape.LineShape, text: Generic.ConvertShapeEnumString(enmShape.LineShape) },
        { value: enmShape.PolygonShape, text: Generic.ConvertShapeEnumString(enmShape.PolygonShape) }];
        cboLayerShape.addSelectList(lShape, 0, false, false);
        // const lMesh = [{ value: enmMesh_Number.mhFirst, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhFirst) },
        // { value: enmMesh_Number.mhSecond, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhSecond) },
        // { value: enmMesh_Number.mhThird, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhThird) },
        // { value: enmMesh_Number.mhHalf, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhHalf) },
        // { value: enmMesh_Number.mhQuarter, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhQuarter) },
        // { value: enmMesh_Number.mhOne_Eighth, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhOne_Eighth) },
        // { value: enmMesh_Number.mhOne_Tenth, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhOne_Tenth) }];
        cboMesh.addSelectList(lShape, 0, false, false);
    }

    btnAddMapfile = function() {
        openMapFile(getFile);
        function getFile(jsonMapData: JsonObject | undefined, filename: string) {
            if (jsonMapData === undefined) {
                Generic.alert(undefined, "読み込めませんでした。");
                return;
            }
            const fname = newAttrData.GetMapFileName();
            if (fname.indexOf(filename.toUpperCase()) !== -1) {
                Generic.alert(undefined, filename + "は既に読み込まれています。");
            }

            const mapdata = new clsMapdata();
            mapdata.openJsonMapData(jsonMapData);
            mapdata.Map.FileName = filename;
            if (fname.length > 0) {
                const z = newAttrData.SetMapFile("").Map.Zahyo;
                const retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
                if (retv.ok === false) {
                    Generic.alert(undefined, filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                    return;
                }
            }
            newAttrData.AddExistingMapData(mapdata, filename);
            lstMapFile.add(filename);
            cboLayerMapFile.addSelectList([filename], undefined, false, false);
            btnRemoveMapfile.disabled = false;
            btnReplaceMapFile.disabled = false;
            btnObjectNameCopy.disabled = false;
            btnAddDefAttr.disabled = false;
            //ktGrid.setVisibility(true);
            gbSearch.disabled = false;
            if (newAttrData.GetNumOfMapFile() === 1) {
                for (let i = 0; i < ktGrid.getLayerMax(); i++) {
                    ktGrid.setLayerData(i, GridLayerData.MapFile, filename);
                }
                Set_LayerTypeShape()
            }
            ErrorCheck();
        }

    }
    
    btnRemoveMapfileClick = function(){
        const sel  = lstMapFile.selectedIndex;
        if( sel === -1){
            Generic.alert(undefined,"地図ファイルを選択して下さい。");
            return;
        }
        const fname = lstMapFile.getText();
        for(let i  = 0 ;i< ktGrid.getLayerMax();i++){
            if (ktGrid.getLayerData(i, GridLayerData.MapFile).toUpperCase() === fname.toUpperCase()){
                Generic.alert(undefined,fname + "は使用されています。");
                return;
            }
        }
        newAttrData.RemoveMapData(fname);
        lstMapFile.removeList(sel,1);
        cboLayerMapFile.remove(sel);
        Set_LayerTypeShape();
    }

    btnReplaceMapfileClick = function() {
        const sel = lstMapFile.selectedIndex;
        if (sel === -1) {
            Generic.alert(undefined, "地図ファイルを選択して下さい。");
            return;
        }
        const repFname = lstMapFile.getText();

        for (let i = 0; i < ktGrid.getLayerMax(); i++) {
            const synf = ktGrid.getLayerData(i, GridLayerData.SyntheticObjF);
            if ((synf === true) && (ktGrid.getLayerData(i, GridLayerData.MapFile) === repFname)) {
                Generic.alert(undefined, "時系列集計されたレイヤで使われているので、差し替えできません。");
                return;
            }
        }

        openMapFile(getFile);
        function getFile(jsonMapData: JsonObject | undefined, filename: string) {
            if (jsonMapData === undefined) {
                Generic.alert(undefined, "読み込めませんでした。");
                return;
            }
            const fname = newAttrData.GetMapFileName();
            if (fname.indexOf(filename.toUpperCase()) !== -1) {
                Generic.alert(undefined, filename + "は既に読み込まれています。");
            }
            const mData = new clsMapdata();
            mData.openJsonMapData(jsonMapData);
            mData.Map.FileName = filename;
    
            newAttrData.RemoveMapData(repFname);
            if (newAttrData.GetNumOfMapFile() > 0) {
                const z = newAttrData.SetMapFile("").Map.Zahyo;
                const retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mData.Map.Zahyo);
                if (retv.ok === false) {
                    Generic.alert(undefined, retv.emes);
                    return;
                }
            }
    
            newAttrData.AddExistingMapData(mData, filename);
            lstMapFile.removeList(sel,1);
            lstMapFile.add(filename)
            cboLayerMapFile.remove(sel);
            cboLayerMapFile.addSelectList([filename], undefined, false, false);
            for (let i = 0; i < ktGrid.getLayerMax(); i++) {
                const oldFname = ktGrid.getLayerData(i, GridLayerData.MapFile);
                if (oldFname === repFname) {
                    ktGrid.setLayerData(i, GridLayerData.MapFile, filename);
                    const LTime = ktGrid.getLayerData(i, GridLayerData.Time);
                    if ((newAttrData.SetMapFile(filename).Map.Time_Mode === true) && (LTime.nullFlag() === true)) {
                        ktGrid.setLayerData(i, GridLayerData.Time, clsTime.GetYMD(new Date()) as unknown as JsonValue);
                    } else if ((newAttrData.SetMapFile(filename).Map.Time_Mode === false) && (LTime.nullFlag() === false)) {
                        ktGrid.setLayerData(i, GridLayerData.Time, clsTime.GetNullYMD() as unknown as JsonValue);
                    }
                }
            }
            Set_LayerTypeShape();
            ErrorCheck();
            }
    }
}

// グローバル関数として公開
(globalThis as any).clsGrid = clsGrid;

}
