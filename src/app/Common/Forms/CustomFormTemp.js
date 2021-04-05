import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import {ReactSortable} from "react-sortablejs";
import React, {Component} from "react";
import CustomFormField from "./CustomFormField";

const DragHandle = SortableHandle(() => <MDBIcon icon={'grip-lines'}/>);

const SortableItem = SortableElement(({value,onRemove,index}) => (
    <div className="SortableItem">
        <CustomFormField type={value} dragHandle={<DragHandle/>} onRemove={onRemove(index)}/>
        {/*{value}*/}

        {/*<button className="Button" onClick={() => onRemove(index)}>Remove</button>*/}
    </div>
));

const SortableList = SortableContainer(({children}) => {
    return <ul>{children}</ul>;

});

class SortableComponent extends Component {
    state = {
        items: [
            'text',
            <CustomFormField type={'text'} dragHandle={<DragHandle/>}/>

        ],
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    remove(index) {
        const items = this.state.items;
        items.splice(index, 1);

        this.setState({items : items})
    }

    add() {
        const items = this.state.items;
        let new_item = this.state.items.length;
        items.push(new_item);
        this.setState({items : items})
        console.log(new_item);
    }

    render() {
        const {items} = this.state;

        return (
            <div>
                <SortableList onSortEnd={this.onSortEnd} useDragHandle>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${value}`}
                                      index={index}
                                      value={value}
                                      onRemove={(index) => this.remove(index)} />
                    ))}
                </SortableList>
                <button onClick={() => this.add()}>Add Document</button>
            </div>
        );
    }
}
export default SortableComponent