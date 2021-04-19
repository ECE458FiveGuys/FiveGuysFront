import React, {Component} from "react";
import html2canvas from "html2canvas";
import {addImage, addTree} from "../DetailPages/InstrumentDetailPage/Sections/Calibration/certificate_writer";
import Tree from "react-tree-graph";
import HTPButton from "../../Common/HTPButton";
import jsPDF from "jspdf";


class TreePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            enable: false,
            instrument_tree: {
                "name": "-----Eve",
                "children": [
                    {"name": "-----Cain"},
                    {"name": "-----Seth",
                        "children": [
                            {"name": "Enos"},
                            {"name": "Noam"}
                        ]
                    },
                    {"name": "Awan",
                    },
                    {"name": "Azura"}
                ]
            },
            certificate: new jsPDF(),

        }
    }



    render() {

        return(
            <div>
                <div id="Tree" onLoad={this.tree_to_pdf()}>
                    <div>
                        <Tree
                            data={this.state.instrument_tree}
                            height={500}
                            width={500}
                        />
                    </div>
                </div>
                <div>
                    <HTPButton label={'Get PDF'} onSubmit={()=>this.pdf_enable()}></HTPButton>
                </div>

            </div>

        )
    }

    async tree_to_pdf(){
        let certificate = new jsPDF()

        if (this.state.enable){
            this.setState({enable: false})
            let html = document.getElementById("Tree")
            html2canvas(html).then((canvas)=> {
                const image = canvas.toDataURL('image/png');
                addTree(certificate, image, 'png')
                certificate.save('Treedf.pdf')
            })
        }
    }

    pdf_enable(){
        this.setState({enable: true})
    }
}

export default TreePage