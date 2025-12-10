export {};
// シェープファイル取得

interface IndexFileDataInfo {
    offset: number;
    contentsLength: number;
}

interface DBFInfo {
    VerData: number;
    RecordNumber: number;
    FieldNumber: number;
    Year: number;
    Month: number;
    dbfDate: number;
    Header_Byte: number;
    Record_Byte: number;
}

interface FieldInfo {
    Name: string;
    StringData_Flag: boolean;
    Length: number;
    PointLen: number;
}

interface BoundingBox {
    maxX: number;
    minX: number;
    maxY: number;
    minY: number;
}

type UnzippedShape = Record<string, Uint8Array>;

clsShapefile = function () {

    class IndexFileData_info implements IndexFileDataInfo {
        offset = 0;
        contentsLength = 0;
    }

    class DBF_Info implements DBFInfo {
        VerData = 0;
        RecordNumber = 0;
        FieldNumber = 0;
        Year = 0;
        Month = 0;
        dbfDate = 0;
        Header_Byte = 0;
        Record_Byte = 0;
    }

    class Field_Info implements FieldInfo {
        Name = "";
        StringData_Flag = false;
        Length = 0;
        PointLen = 0;
    }

    const boundingBox: BoundingBox = { maxX: 0, minX: 0, maxY: 0, minY: 0 };

    let enmShape = {
        NotDeffinition: -1,
        PointShape: 0,
        LineShape: 1,
        PolygonShape: 2
    }
    let endian = {
        little: true,
        big: false
    }

    let ZahyoSettingFlag=false;
    this.getMapZahyo=function(){
        return MapZahyo.Clone();;
    }
    this.setMapZahyo=function(zahyo: Zahyo_info){
        MapZahyo=zahyo.Clone();
    }
    this.getZahyoSettingFlag=function(){
        return ZahyoSettingFlag;
    }

    let FileName: string;
    let MapZahyo = new Zahyo_info();
    MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
    MapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
    MapZahyo.HeimenTyokkaku_KEI_Number = 1;

    let IndexData: IndexFileData_info[] = [];
    let C_Point: point[] = [];
    let PointIndex: number[][] = [];
    let Points: point[] = [];
    let ShapeS: number;
    let FieldDT: Field_Info[] = [];
    let DataStr: string[][] = [];
    let onError: ((tag: unknown) => void) | undefined;
    let tag: unknown;
    let getSHXFile: (buffer: ArrayBuffer) => IndexFileData_info[] | undefined;
    let getShapeFile: (buffer: ArrayBuffer) => boolean | undefined;
    let getDbfFile: (buffer: ArrayBuffer, encodenumber: string | number) => boolean;
    let getPrjFile: (Prjtext: string) => boolean;
    this.getShape=function(){
        return ShapeS;
    }
    
    this.fileRead = function (files: File[], dbfEncode: string | number, _tag: unknown, onOK: (tag: unknown) => void, _onError: (tag: unknown) => void) {
        onError = _onError;
        tag = _tag;
        let shxFile: File | undefined;
        let shapeFile: File | undefined;
        let dbfFile: File | undefined;
        let prjFile: File | undefined;
        FileName = Generic.getFilenameWithoutExtension(files[0].name);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let ext = file.name.slice(-3).toLowerCase();
            if (ext == "shx") {
                shxFile = file;
            }
            if (ext == "shp") { shapeFile = file; }
            if (ext == "dbf") { dbfFile = file; }
            if (ext == "prj") { prjFile = file; }
        }
        let okf = true;
        const shxReader = new FileReader();
        if (!shxFile || !shapeFile || !dbfFile) {
            onError?.(tag);
            return;
        }
        shxReader.readAsArrayBuffer(shxFile);
        //ファイルの読込が終了した時の処理
        shxReader.onload = function (evt) {
            IndexData = [];
            if (shxReader.result instanceof ArrayBuffer) {
                getSHXFile(shxReader.result);
            }
            const shpReader = new FileReader();
            shpReader.readAsArrayBuffer(shapeFile);
            shpReader.onload = function (evt) {
                if (shpReader.result instanceof ArrayBuffer) {
                    getShapeFile(shpReader.result);
                }
                const dbfReader = new FileReader();
                dbfReader.readAsArrayBuffer(dbfFile);
                dbfReader.onload = function (evt) {
                    try {
                        if (dbfReader.result instanceof ArrayBuffer) {
                            getDbfFile(dbfReader.result, dbfEncode);
                        }
                    }
                    catch (e) {
                        okf = false;
                        onError?.(tag);
                        return;
                    }
                    if (prjFile != undefined) {
                        const prjReader = new FileReader();
                        prjReader.readAsText(prjFile, 'utf8');
                        prjReader.onload = function (evt) {
                            if (typeof prjReader.result === 'string') {
                                ZahyoSettingFlag = getPrjFile(prjReader.result);
                            }
                            //onloadFunction(MapZahyo, boundingBox, ShapeS, C_Point, PointIndex, Points, FieldDT, DataStr);
                            if (okf == true) {
                                onOK(tag);
                            }
                        }
                    } else {
                        if (okf == true) {
                            onOK(tag);
                        }
                        //onloadFunction(MapZahyo, boundingBox, ShapeS, C_Point, PointIndex, Points, FieldDT, DataStr);
                    }
                }
            }
        }
    }

    /**zipファイル圧縮シェープファイル */
    this.fileReadZip= function (unZipData: UnzippedShape, dbfEncode: string | number, _tag: unknown, onOK: (tag: unknown) => void) {
        tag = _tag;
        let shxFile: string | undefined;
        let shapeFile: string | undefined;
        let dbfFile: string | undefined;
        let prjFile: string | undefined;
        for (let file  in unZipData) {
            let ext =Generic.getExtension(file).toLowerCase();
            if (ext == "shx") { shxFile = file; }
            if (ext == "shp") { 
                shapeFile = file;
                FileName = Generic.getFilenameWithoutExtension(shapeFile);
             }
            if (ext == "dbf") { dbfFile = file; }
            if (ext == "prj") { prjFile = file; }
        }
        IndexData = [];
        if (!shxFile || !shapeFile || !dbfFile) {
            return;
        }
        const shxData = unZipData[shxFile];
        const shpData = unZipData[shapeFile];
        const dbfData = unZipData[dbfFile];
        if (shxData && shpData && dbfData) {
            getSHXFile(Uint8Array.from(shxData).buffer);
            getShapeFile(Uint8Array.from(shpData).buffer);
            getDbfFile(Uint8Array.from(dbfData).buffer, dbfEncode);
        }
        if (prjFile != undefined) {
            let prjtx = Generic.utf8ArrayToStr(unZipData[prjFile]);
            ZahyoSettingFlag = getPrjFile(prjtx);
        }
        onOK(tag);
    }

    //prjファイル読み込み
    getPrjFile = function (Prjtext: string) {
        const FData = Prjtext.toUpperCase();
        if (FData.indexOf("UNDEFINED") != -1) {
            return false;
        }

        let fixf = false;
        if ((FData.indexOf("D_TOKYO") != -1)) {
            //日本測地系
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            MapZahyo.System = enmZahyo_System_Info.Zahyo_System_tokyo;
            fixf = true;
        }

        if ((FData.indexOf("D_JGD_2000") != -1) || (FData.indexOf("D_JGD_2011") != -1) ||
            ((FData.indexOf("D_WGS84") != -1) || (FData.indexOf("D_WGS_1984") != -1))) {
            //'世界測地系
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            MapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
            fixf = true;
        }
        if ((FData.indexOf("JAPAN_ZONE_") != -1)) {
            //平面直角
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku;
            MapZahyo.HeimenTyokkaku_KEI_Number = parseInt(FData.substr(FData.indexOf("JAPAN_ZONE_") + 11, 2));
            fixf = true;
        } else {
            let HC = "Japan_Plane_Rectangular_CS_";
            let heimen_Code = [];

            heimen_Code[1] = HC + "I";
            heimen_Code[2] = HC + "II";
            heimen_Code[3] = HC + "III";
            heimen_Code[4] = HC + "IV";
            heimen_Code[5] = HC + "V";
            heimen_Code[6] = HC + "VI";
            heimen_Code[7] = HC + "VII";
            heimen_Code[8] = HC + "VIII";
            heimen_Code[9] = HC + "IX";
            heimen_Code[10] = HC + "X";
            heimen_Code[11] = HC + "XI";
            heimen_Code[12] = HC + "XII";
            heimen_Code[13] = HC + "XIII";
            heimen_Code[14] = HC + "XIV";
            heimen_Code[15] = HC + "XV";
            heimen_Code[16] = HC + "XVI";
            heimen_Code[17] = HC + "XVII";
            heimen_Code[18] = HC + "XVII";
            heimen_Code[19] = HC + "XIX";
            for (let i = 19; i > 0; i--) {
                if ((FData.indexOf(heimen_Code[i].toUpperCase()) != -1)) { //平面直角
                    MapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku
                    MapZahyo.HeimenTyokkaku_KEI_Number = i;
                    fixf = true;
                    break;
                }
            }
        }
        return fixf;
    }


    //dbfファイル読み込み
    getDbfFile = function (buffer: ArrayBuffer, encodenumber: string | number) {

        const dv = new DataView(buffer);

        let DataSet = new DBF_Info();

        DataSet.VerData = dv.getInt8(0); //Ver=3  = VerData And 7 
        DataSet.Year = dv.getInt8(1) //Year-1900
        DataSet.Month = dv.getInt8(2);
        DataSet.dbfDate = dv.getInt8(3);
        DataSet.RecordNumber = dv.getUint32(4, endian.little);
        DataSet.Header_Byte = dv.getUint16(8, endian.little);
        DataSet.Record_Byte = dv.getUint16(10, endian.little); //sum(FieldDT().Length)+1
        DataSet.FieldNumber = Math.floor((DataSet.Header_Byte - 33) / 32);
        let pos = 12;
        pos += 4;
        pos += 12;
        pos += 4;
        //フィールド記述子配列読み込み
        for (let i = 0; i < DataSet.FieldNumber; i++) {
            let fd = new Field_Info();
            fd.Name = Get_WCharData_Binary(pos, 11, encodenumber.toString()).trim();
            pos += 11;
            let fieldType = String.fromCharCode(dv.getInt8(pos));
            switch (fieldType) {
                case "C":
                case "D":
                case "M":
                case "L": {
                    fd.StringData_Flag = true;
                    break;
                }
                case "F":
                case "N":
                    {
                    fd.StringData_Flag = false;
                    break;
                    }
            }
            pos += 1;
            pos += 4;
            fd.Length = dv.getUint8(pos)
            fd.PointLen = dv.getUint8(pos + 1)
            pos += 2;
            pos += 3;
            pos += 10;
            pos += 1;
            FieldDT.push(fd);
        }
        pos++;
        //データベースレコード読み込み
        for (let i = 0; i < DataSet.RecordNumber; i++) {
            pos++;
            let fdata = [];
            for (let j = 0; j < DataSet.FieldNumber; j++) {
                let dt = Get_WCharData_Binary(pos, FieldDT[j].Length, encodenumber.toString()).trim();
                fdata.push(dt);
                pos += FieldDT[j].Length;
            }
            DataStr.push(fdata);
        }
        return true;



        function Get_WCharData_Binary(Position: number, GetLen: number, encode: string) {
            const ubt: number[] = [];
            for (let i = 0; i < GetLen; i++) {
                ubt.push(dv.getInt8(Position + i));
            }
            let text_decoder = new TextDecoder(encode);
            let retstr = text_decoder.decode(Uint8Array.from(ubt).buffer);
            let czero: number;
            do {
                czero = retstr.indexOf(String.fromCharCode(0));
                if (czero != -1) {
                    retstr = retstr.slice(0, czero) + retstr.slice(czero + 1);
                }
            } while (czero != -1)

            return retstr;
        }
    }

    //shxファイル読み込み
    getSHXFile = function (buffer: ArrayBuffer) {

            const dv = new DataView(buffer)

            let fcode = dv.getUint32(0, endian.big);
            let flen = dv.getUint32(24, endian.big) * 2 - 100;
            let fc2 = dv.getUint16(28, endian.little);
            boundingBox.minX = dv.getFloat64(36, endian.little);
            boundingBox.minY = dv.getFloat64(44, endian.little);
            boundingBox.maxX = dv.getFloat64(52, endian.little);
            boundingBox.maxY = dv.getFloat64(60, endian.little);
            for (let i = 0; i < flen; i += 8) {
                let dt = new IndexFileData_info();
                dt.offset = dv.getUint32(i + 100, false);
                dt.contentsLength = dv.getUint32(i + 104, false);
                IndexData.push(dt);
            }
            return IndexData;

    }


    //shpファイル読み込み
    getShapeFile = function (buffer: ArrayBuffer) {
            const dv = new DataView(buffer);
    
            let fcode = dv.getUint32(0, endian.big);
            let flen = dv.getUint32(24, endian.big) * 2 - 100;
            let fc2 = dv.getUint16(28, endian.little);
    
            const shapeType = dv.getUint32(32, endian.little);
            switch (shapeType) {
                case 1:
                case 11:
                case 21: {
                    ShapeS = enmShape.PointShape;
                    break;
                }
                case 3:
                case 13:
                case 23: {
                    ShapeS = enmShape.LineShape;
                    break;
                }
                case 5:
                case 15:
                case 25: {
                    ShapeS = enmShape.PolygonShape;
                    break;
                }
                default:
                    return;
            }
    
            let n = 0;
    
            do {
                
                let pos = IndexData[n].offset * 2;
                let RecordNumber = dv.getUint32(pos, endian.big)+12;
                if (RecordNumber == 0) {
                    break;
                }
                switch (shapeType) {
                    case 1:
                    case 11:
                    case 21: {
                        pos += 12;
                        let p = getPointXY(dv, pos);
                        C_Point.push(p);
                        break;
                    }
                    case 3:
                    case 5:
                    case 13:
                    case 15:
                    case 23:
                    case 25: {
                        pos += 44;
                        let NumParts = dv.getUint32(pos, endian.little );
                        let NumPoints = dv.getUint32(pos + 4, endian.little);
                        pos += 8;
                        let pindex2 = [];
                        for (let i = 0; i < NumParts; i++) {
                            pindex2.push(dv.getUint32(pos, endian.little));
                            pos += 4;
                        }
                        for (let i = 0; i < NumPoints; i++) {
                            Points.push(getPointXY(dv, pos));
                            pos += 16;
                        }
                        pindex2.push(NumPoints);
                        PointIndex.push(pindex2);
                        break;
                    }
                }
                n++;
            } while (n < IndexData.length);
            return true;

    

        function getPointXY(dv: DataView, pos: number) {
            let p = new point();
            p.x = dv.getFloat64(pos, endian.little);
            p.y = dv.getFloat64(pos + 8, endian.little);
            return p;
        }
    }

    //読み込んだシェープファイルを地図ファイルに変換する
    this.convertToMapfile = function (projection: number | undefined, UnitCheckFlag: boolean) {
        let MapData = new clsMapdata();
        MapData.init_MapData();
        MapData.Add_OneObjectGroup_Parameter(FileName, ShapeS, enmMesh_Number.mhNonMesh, enmObjectGoupType_Data.NormalObject);
        if (ShapeS != enmShape.PointShape) {
            let lp = clsBase.Line();
            if (IndexData.length > 500) {
                lp.BlankF = true;
            }
            MapData.Add_OneLineKind(FileName, lp, enmMesh_Number.mhNonMesh);
        }

        const Obk = 0;
        const LK = 0;
        let pos = 0;
        for (let n = 0; n < IndexData.length; n++) {
            let newObj = MapData.Init_One_Object(Obk);
            newObj.Shape = ShapeS;
            newObj.NameTimeSTC[0].NamesList[0] = FileName + String(n);
            switch (ShapeS) {
                case enmShape.PointShape:
                    newObj.CenterPSTC[0].Position  = C_Point[n].Clone();
                    break;
                default:
                    let AlinS = MapData.Map.ALIN;
                    let NumParts = PointIndex[n];
                    newObj.NumOfLine = NumParts.length-1;
                    for (let i = 0; i < NumParts.length-1; i++) {
                        let newLine = MapData.Init_One_Line(LK);
                        newLine.NumOfPoint = NumParts[i + 1] - NumParts[i];
                        for (let j = 0; j < newLine.NumOfPoint; j++) {
                            newLine.PointSTC.push(Points[pos].Clone());
                            pos++;
                        }
                        MapData.Save_Line(newLine, false, false, false);
                    }

                    for (let j = 0; j < newObj.NumOfLine; j++) {
                        let lc = new LineCodeStac_Data();
                        lc.LineCode = AlinS + j;
                        lc.NumOfTime = 0;
                        newObj.LineCodeSTC.push(lc);
                    }
                    newObj.CenterPSTC[0].Position = MapData.MPLine[newObj.LineCodeSTC[0].LineCode].PointSTC[0].Clone();
                    break;
            }
            MapData.Save_Object(newObj, false);
        }

        let unit = []
        if (UnitCheckFlag == true) {
            unit = Generic.Check_DataType(FieldDT.length, IndexData.length, DataStr);
        } else {
            for (let i = 0; i < FieldDT.length; i++) {
                let fd = FieldDT[i];
                let unt = "";
                if (fd.StringData_Flag == true) {
                    unt = "STR";
                }
                unit.push(unt);
            }
        }
        for (let i = 0; i < FieldDT.length; i++) {
            let fd = FieldDT[i];
            MapData.Add_one_DefAttDataSet(Obk, fd.Name, unit[i], "");
        }

        for (let i = 0; i < IndexData.length; i++) {
            let mo = MapData.MPObj[i];
            for (let j = 0; j < FieldDT.length; j++) {
                let defv = new strDefTimeAttDataEach_Info();
                defv.Value = DataStr[i][j];
                let defa=new strDefTimeAttData_Info();
                defa.Data.push(defv);
                mo.DefTimeAttValue.push(defa);
            }
        }

        MapData.Map.Zahyo = MapZahyo.Clone();
        MapData.Map.Zahyo.Projection=projection;
        MapData.Map.FileName = FileName;
        MapData.Map.FullPath = "";
        MapData.NoDataFlag = false;
        MapData.Set_First_ObjectKind_Color();
        switch (MapData.Map.Zahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_Ido_Keido:
            MapData.Checl_All_Line_Maxmin();
             MapData.MapLatLon_Zahyo_convert();
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                MapData.YReverse()
                MapData.Checl_All_Line_Maxmin();
                MapData.Check_All_Obj_MaxMin();
                MapData.GetObjectGravity_All();
                MapData.Map.SCL = 1000;
                MapData.Map.SCL_U = enmScaleUnit.kilometer;
                MapData.Map.Circumscribed_Rectangle = MapData.Get_Mapfile_Rectangle();
                break;
            case enmZahyo_mode_info.Zahyo_No_Mode:
                MapData.Checl_All_Line_Maxmin();
                MapData.Check_All_Obj_MaxMin();
                MapData.GetObjectGravity_All();
                MapData.Map.SCL = 1;
                MapData.Map.SCL_U = enmScaleUnit.kilometer;
                MapData.Map.Circumscribed_Rectangle = MapData.Get_Mapfile_Rectangle();
                break;
        }
        return MapData;
    }
}
