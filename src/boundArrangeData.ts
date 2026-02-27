import type { Line_Property, Mark_Property } from './clsTime';
import type { Fringe_Line_Info } from './clsPrint';

export class boundArrangeData {
    Mark?: Mark_Property;
    Line?: Line_Property;
    Fringe?: Fringe_Line_Info[];
    Arrange_LineCode?: number[][];
    Pon: number;

    constructor() {
        this.Pon = 0;
        this.Fringe = [];
        this.Arrange_LineCode = [];
    }
}
