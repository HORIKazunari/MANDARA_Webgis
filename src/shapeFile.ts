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

// 内部クラスの定義
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

const enmShape = {
    NotDeffinition: -1,
    PointShape: 0,
    LineShape: 1,
    PolygonShape: 2
} as const;

const endian = {
    little: true,
    big: false
} as const;

export class clsShapefile {
    private boundingBox: BoundingBox = { maxX: 0, minX: 0, maxY: 0, minY: 0 };
    private zahyoSettingFlag = false;
    private fileName: string = "";
    private mapZahyo: Zahyo_info;
    private indexData: IndexFileData_info[] = [];
    private c_Point: point[] = [];
    private pointIndex: number[][] = [];
    private points: point[] = [];
    private shapeS!: number;
    private fieldDT: Field_Info[] = [];
    private dataStr: string[][] = [];
    private onError: ((tag: unknown) => void) | undefined;
    private tag: unknown;

    constructor() {
        this.mapZahyo = new Zahyo_info();
        this.mapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
        this.mapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
        this.mapZahyo.HeimenTyokkaku_KEI_Number = 1;
    }

    getMapZahyo(): Zahyo_info {
        return this.mapZahyo.Clone();
    }

    setMapZahyo(zahyo: Zahyo_info): void {
        this.mapZahyo = zahyo.Clone();
    }

    getZahyoSettingFlag(): boolean {
        return this.zahyoSettingFlag;
    }

    getShape(): number {
        return this.shapeS;
    }
    
    fileRead(files: File[], dbfEncode: string | number, _tag: unknown, onOK: (tag: unknown) => void, _onError: (tag: unknown) => void): void {
        this.onError = _onError;
        this.tag = _tag;
        const shxFile: File | undefined = files.find(f => f.name.slice(-3).toLowerCase() === "shx");
        const shapeFile: File | undefined = files.find(f => f.name.slice(-3).toLowerCase() === "shp");
        const dbfFile: File | undefined = files.find(f => f.name.slice(-3).toLowerCase() === "dbf");
        const prjFile: File | undefined = files.find(f => f.name.slice(-3).toLowerCase() === "prj");
        this.fileName = Generic.getFilenameWithoutExtension(files[0].name);
        let okf = true;
        const shxReader = new FileReader();
        if (!shxFile || !shapeFile || !dbfFile) {
            this.onError?.(this.tag);
            return;
        }
        shxReader.readAsArrayBuffer(shxFile);
        //ファイルの読込が終了した時の処理
        shxReader.onload = () => {
            this.indexData = [];
            if (shxReader.result instanceof ArrayBuffer) {
                this.getSHXFile(shxReader.result);
            }
            const shpReader = new FileReader();
            shpReader.readAsArrayBuffer(shapeFile);
            shpReader.onload = () => {
                if (shpReader.result instanceof ArrayBuffer) {
                    this.getShapeFile(shpReader.result);
                }
                const dbfReader = new FileReader();
                dbfReader.readAsArrayBuffer(dbfFile);
                dbfReader.onload = () => {
                    try {
                        if (dbfReader.result instanceof ArrayBuffer) {
                            this.getDbfFile(dbfReader.result, dbfEncode);
                        }
                    }
                    catch (e) {
                        okf = false;
                        this.onError?.(this.tag);
                        return;
                    }
                    if (prjFile != undefined) {
                        const prjReader = new FileReader();
                        prjReader.readAsText(prjFile, 'utf8');
                        prjReader.onload = () => {
                            if (typeof prjReader.result === 'string') {
                                this.zahyoSettingFlag = this.getPrjFile(prjReader.result);
                            }
                            if (okf == true) {
                                onOK(this.tag);
                            }
                        };
                    } else {
                        if (okf == true) {
                            onOK(this.tag);
                        }
                    }
                };
            };
        };
    }

    /**zipファイル圧縮シェープファイル */
    fileReadZip(unZipData: UnzippedShape, dbfEncode: string | number, _tag: unknown, onOK: (tag: unknown) => void): void {
        this.tag = _tag;
        let shxFile: string | undefined;
        let shapeFile: string | undefined;
        let dbfFile: string | undefined;
        let prjFile: string | undefined;
        for (const file in unZipData) {
            const ext = Generic.getExtension(file).toLowerCase();
            if (ext == "shx") { shxFile = file; }
            if (ext == "shp") { 
                shapeFile = file;
                this.fileName = Generic.getFilenameWithoutExtension(shapeFile);
             }
            if (ext == "dbf") { dbfFile = file; }
            if (ext == "prj") { prjFile = file; }
        }
        this.indexData = [];
        if (!shxFile || !shapeFile || !dbfFile) {
            return;
        }
        const shxData = unZipData[shxFile];
        const shpData = unZipData[shapeFile];
        const dbfData = unZipData[dbfFile];
        if (shxData && shpData && dbfData) {
            this.getSHXFile(Uint8Array.from(shxData).buffer);
            this.getShapeFile(Uint8Array.from(shpData).buffer);
            this.getDbfFile(Uint8Array.from(dbfData).buffer, dbfEncode);
        }
        if (prjFile != undefined) {
            const prjtx = Generic.utf8ArrayToStr(unZipData[prjFile]);
            this.zahyoSettingFlag = this.getPrjFile(prjtx);
        }
        onOK(this.tag);
    }

    //prjファイル読み込み
    private getPrjFile(Prjtext: string): boolean {
        const FData = Prjtext.toUpperCase();
        if (FData.indexOf("UNDEFINED") != -1) {
            return false;
        }

        let fixf = false;
        if ((FData.indexOf("D_TOKYO") != -1)) {
            //日本測地系
            this.mapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            this.mapZahyo.System = enmZahyo_System_Info.Zahyo_System_tokyo;
            fixf = true;
        }

        if ((FData.indexOf("D_JGD_2000") != -1) || (FData.indexOf("D_JGD_2011") != -1) ||
            ((FData.indexOf("D_WGS84") != -1) || (FData.indexOf("D_WGS_1984") != -1))) {
            //'世界測地系
            this.mapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            this.mapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
            fixf = true;
        }
        if ((FData.indexOf("JAPAN_ZONE_") != -1)) {
            //平面直角
            this.mapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku;
            this.mapZahyo.HeimenTyokkaku_KEI_Number = parseInt(FData.substr(FData.indexOf("JAPAN_ZONE_") + 11, 2));
            fixf = true;
        } else {
            const HC = "Japan_Plane_Rectangular_CS_";
            const heimen_Code = [];

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
                    this.mapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku;
                    this.mapZahyo.HeimenTyokkaku_KEI_Number = i;
                    fixf = true;
                    break;
                }
            }
        }
        return fixf;
    }


    //dbfファイル読み込み
    private getDbfFile(buffer: ArrayBuffer, encodenumber: string | number): boolean {

        const dv = new DataView(buffer);

        const DataSet = new DBF_Info();

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
            const fd = new Field_Info();
            fd.Name = Get_WCharData_Binary(pos, 11, encodenumber.toString()).trim();
            pos += 11;
            const fieldType = String.fromCharCode(dv.getInt8(pos));
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
            this.fieldDT.push(fd);
        }
        pos++;
        //データベースレコード読み込み
        for (let i = 0; i < DataSet.RecordNumber; i++) {
            pos++;
            const fdata = [];
            for (let j = 0; j < DataSet.FieldNumber; j++) {
                const dt = Get_WCharData_Binary(pos, this.fieldDT[j].Length, encodenumber.toString()).trim();
                fdata.push(dt);
                pos += this.fieldDT[j].Length;
            }
            this.dataStr.push(fdata);
        }
        return true;



        function Get_WCharData_Binary(Position: number, GetLen: number, encode: string) {
            const ubt: number[] = [];
            for (let i = 0; i < GetLen; i++) {
                ubt.push(dv.getInt8(Position + i));
            }
            const text_decoder = new TextDecoder(encode);
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
    private getSHXFile(buffer: ArrayBuffer): IndexFileData_info[] | undefined {

            const dv = new DataView(buffer);

            const fcode = dv.getUint32(0, endian.big);
            const flen = dv.getUint32(24, endian.big) * 2 - 100;
            const fc2 = dv.getUint16(28, endian.little);
            this.boundingBox.minX = dv.getFloat64(36, endian.little);
            this.boundingBox.minY = dv.getFloat64(44, endian.little);
            this.boundingBox.maxX = dv.getFloat64(52, endian.little);
            this.boundingBox.maxY = dv.getFloat64(60, endian.little);
            for (let i = 0; i < flen; i += 8) {
                const dt = new IndexFileData_info();
                dt.offset = dv.getUint32(i + 100, false);
                dt.contentsLength = dv.getUint32(i + 104, false);
                this.indexData.push(dt);
            }
            return this.indexData;

    }


    //shpファイル読み込み
    private getShapeFile(buffer: ArrayBuffer): boolean | undefined {
            const dv = new DataView(buffer);
    
            const fcode = dv.getUint32(0, endian.big);
            const flen = dv.getUint32(24, endian.big) * 2 - 100;
            const fc2 = dv.getUint16(28, endian.little);
    
            const shapeType = dv.getUint32(32, endian.little);
            switch (shapeType) {
                case 1:
                case 11:
                case 21: {
                    this.shapeS = enmShape.PointShape;
                    break;
                }
                case 3:
                case 13:
                case 23: {
                    this.shapeS = enmShape.LineShape;
                    break;
                }
                case 5:
                case 15:
                case 25: {
                    this.shapeS = enmShape.PolygonShape;
                    break;
                }
                default:
                    return;
            }
    
            let n = 0;
    
            do {
                
                let pos = this.indexData[n].offset * 2;
                const RecordNumber = dv.getUint32(pos, endian.big)+12;
                if (RecordNumber == 0) {
                    break;
                }
                switch (shapeType) {
                    case 1:
                    case 11:
                    case 21: {
                        pos += 12;
                        const p = getPointXY(dv, pos);
                        this.c_Point.push(p);
                        break;
                    }
                    case 3:
                    case 5:
                    case 13:
                    case 15:
                    case 23:
                    case 25: {
                        pos += 44;
                        const NumParts = dv.getUint32(pos, endian.little );
                        const NumPoints = dv.getUint32(pos + 4, endian.little);
                        pos += 8;
                        const pindex2 = [];
                        for (let i = 0; i < NumParts; i++) {
                            pindex2.push(dv.getUint32(pos, endian.little));
                            pos += 4;
                        }
                        for (let i = 0; i < NumPoints; i++) {
                            this.points.push(getPointXY(dv, pos));
                            pos += 16;
                        }
                        pindex2.push(NumPoints);
                        this.pointIndex.push(pindex2);
                        break;
                    }
                }
                n++;
            } while (n < this.indexData.length);
            return true;

    

        function getPointXY(dv: DataView, pos: number) {
            const p = new point();
            p.x = dv.getFloat64(pos, endian.little);
            p.y = dv.getFloat64(pos + 8, endian.little);
            return p;
        }
    }

    //読み込んだシェープファイルを地図ファイルに変換する
    convertToMapfile(projection: number | undefined, UnitCheckFlag: boolean): clsMapdata {
        const MapData = new clsMapdata();
        MapData.init_MapData();
        MapData.Add_OneObjectGroup_Parameter(this.fileName, this.shapeS, enmMesh_Number.mhNonMesh, enmObjectGoupType_Data.NormalObject);
        if (this.shapeS != enmShape.PointShape) {
            const lp = clsBase.Line();
            if (this.indexData.length > 500) {
                lp.BlankF = true;
            }
            MapData.Add_OneLineKind(this.fileName, lp, enmMesh_Number.mhNonMesh);
        }

        const Obk = 0;
        const LK = 0;
        let pos = 0;
        for (let n = 0; n < this.indexData.length; n++) {
            const newObj = MapData.Init_One_Object(Obk);
            newObj.Shape = this.shapeS;
            newObj.NameTimeSTC[0].NamesList[0] = this.fileName + String(n);
            switch (this.shapeS) {
                case enmShape.PointShape:
                    newObj.CenterPSTC[0].Position  = this.c_Point[n].Clone();
                    break;
                default:
                    const AlinS = MapData.Map.ALIN;
                    const NumParts = this.pointIndex[n];
                    newObj.NumOfLine = NumParts.length-1;
                    for (let i = 0; i < NumParts.length-1; i++) {
                        const newLine = MapData.Init_One_Line(LK);
                        newLine.NumOfPoint = NumParts[i + 1] - NumParts[i];
                        for (let j = 0; j < newLine.NumOfPoint; j++) {
                            newLine.PointSTC.push(this.points[pos].Clone());
                            pos++;
                        }
                        MapData.Save_Line(newLine, false, false, false);
                    }

                    for (let j = 0; j < newObj.NumOfLine; j++) {
                        const lc = new LineCodeStac_Data();
                        lc.LineCode = AlinS + j;
                        lc.NumOfTime = 0;
                        newObj.LineCodeSTC.push(lc);
                    }
                    newObj.CenterPSTC[0].Position = MapData.MPLine[newObj.LineCodeSTC[0].LineCode].PointSTC[0].Clone();
                    break;
            }
            MapData.Save_Object(newObj, false);
        }

        let unit = [];
        if (UnitCheckFlag == true) {
            unit = Generic.Check_DataType(this.fieldDT.length, this.indexData.length, this.dataStr);
        } else {
            for (let i = 0; i < this.fieldDT.length; i++) {
                const fd = this.fieldDT[i];
                let unt = "";
                if (fd.StringData_Flag == true) {
                    unt = "STR";
                }
                unit.push(unt);
            }
        }
        for (let i = 0; i < this.fieldDT.length; i++) {
            const fd = this.fieldDT[i];
            MapData.Add_one_DefAttDataSet(Obk, fd.Name, unit[i], "");
        }

        for (let i = 0; i < this.indexData.length; i++) {
            const mo = MapData.MPObj[i];
            for (let j = 0; j < this.fieldDT.length; j++) {
                const defv = new strDefTimeAttDataEach_Info();
                defv.Value = this.dataStr[i][j];
                const defa=new strDefTimeAttData_Info();
                defa.Data.push(defv);
                mo.DefTimeAttValue.push(defa);
            }
        }

        MapData.Map.Zahyo = this.mapZahyo.Clone();
        MapData.Map.Zahyo.Projection=projection;
        MapData.Map.FileName = this.fileName;
        MapData.Map.FullPath = "";
        MapData.NoDataFlag = false;
        MapData.Set_First_ObjectKind_Color();
        switch (MapData.Map.Zahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_Ido_Keido:
            MapData.Checl_All_Line_Maxmin();
             MapData.MapLatLon_Zahyo_convert();
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                MapData.YReverse();
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
