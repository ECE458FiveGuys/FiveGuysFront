import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import {Canvas} from "canvas";

// Barcode label: An adhesive label affixed to assets bearing the text “HPT Asset” and the
// asset number; the number is also shown as a barcode (Code 128 type C). Labels are 1.75”x0.5”
// in size and are to be printed on Avery type 5167 label paper. An example mockup of a label
// is shown below.

const LABEL_WIDTH = 1.75;
const LABEL_HEIGHT = 0.5;
const HORIZONTAL_MARGIN = 0.28125;

const LABELS_PER_COLUMN = 20;

const LEFT_SIDE_MARGIN = 0.33;

const LABEL_CONTAINER_WIDTH = LABEL_WIDTH + HORIZONTAL_MARGIN;
const LABEL_CONTAINER_HEIGHT = LABEL_HEIGHT;

const PAGE_HEIGHT = 11;
const PAGE_WIDTH = 8.5;

const PAGE_OPTIONS = {
    orientation: "p",
    unit: "in",
    format: [PAGE_WIDTH,PAGE_HEIGHT],
}

const LABEL_OPTIONS = {
    format: "CODE128C",
    height: 0.5 - 0.1,
    width: 1.75 - 0.2,
    textAlign: "right",
    textPosition: "bottom"

}

export function generateLabels(instruments) {

    let labelPage = new jsPDF(PAGE_OPTIONS)

    let label_num = 0;

    instruments.forEach((instrument) => {
        label_num++
        let text = "HTP Asset     " + instrument.asset_tag_number
        const canvas = new Canvas()
        JsBarcode(canvas, text, {...LABEL_OPTIONS})

        let row = label_num % LABELS_PER_COLUMN;
        let col = Math.floor(label_num / LABELS_PER_COLUMN);

        let x = col * LABEL_CONTAINER_WIDTH + LEFT_SIDE_MARGIN;
        let y = row * LABEL_CONTAINER_HEIGHT;
        labelPage.addImage(canvas, 'JPEG', x, y, LABEL_CONTAINER_WIDTH, LABEL_CONTAINER_HEIGHT);
    })

    labelPage.save(`labels.pdf`) // Consider adding filters here in file descriptor
}