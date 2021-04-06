import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import {ReactSortable} from "react-sortablejs";
import React, {Component} from "react";
import CustomFormField from "./CustomFormField";
import {forEach} from "react-bootstrap/ElementChildren";
import HTPNavBar from "../HTPNavBar";
import './CreateCusotmForm.css';

const DragHandle = SortableHandle(() => <MDBIcon icon={'grip-lines'} size={'2x'}/>);

const SortableItem = SortableElement(({value,onRemove}) => (
    <div className="SortableItem">
        {<CustomFormField type={value.type} id={value.id} dragHandle={<DragHandle/>} onRemove={() => onRemove(value.id)}/>}
    </div>
));

const SortableList = SortableContainer(({children}) => {
    return <ul>{children}</ul>;

});

class SortableComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [
                {id:0,type:'header'},
                {id:1,type:'text'},
                {id:2,type:'input'},
            ],
            nextFieldId: 3
        };
    }


    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    remove = (id) => {
        if(this.state) {
            console.log(id)

            let items = this.state.items;

            const newList = items.filter((item) => item.id !== id);
            // items.splice(index, 1);

            this.setState({items: newList})
        }

    }

    add(inputType) {
        const {items,nextFieldId} = this.state;
        let new_item = {id:nextFieldId, type:inputType};
        let newFieldId = nextFieldId + 1;
        items.push(new_item);

        this.setState({items : items, nextFieldId:newFieldId})
        console.log(new_item);
    }

    render() {
        const {items} = this.state;
        let {user,location} = this.props;
        return (
            <div>
                <HTPNavBar user={user} location={location}/>
                <MDBContainer>
                    <MDBCol>
                        <MDBRow>
                            <Button variant={"blue"} onClick={() => this.add()}>Return to model</Button>
                        </MDBRow>
                        <MDBRow>
                            <SortableList onSortEnd={this.onSortEnd} useDragHandle>
                                {items.map((value, index) => (
                                    <SortableItem key={`item-${value}`}
                                                  index={index}
                                                  value={value}
                                                  onRemove={this.remove} />
                                ))}
                            </SortableList>
                        </MDBRow>
                        <MDBRow>
                            {/*{Object.keys(CustomFormField.INPUTS).forEach((inputType) =>*/}
                            <Button variant={"blue"} onClick={() => this.add("text")}>{"text"}</Button>
                            <Button variant={"blue"} onClick={() => this.add("header")}>{"header"}</Button>
                            <Button variant={"blue"} onClick={() => this.add("input")}>{"input"}</Button>
                            {/*)}*/}
                            {/*<Button variant={"blue"} onClick={() => this.add()}>Add Field</Button>*/}
                        </MDBRow>
                    </MDBCol>
                </MDBContainer>
            </div>
        );
    }
}
export default SortableComponent