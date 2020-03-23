import React, {useState} from 'react';
import './App.css';
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function versatileChangeFile(treeKeys, value, tree) {
    let newValue = [...treeKeys];

    newValue[newValue.indexOf(tree)] = value;
    localStorage.setItem("treeKeys", JSON.stringify(newValue));

    return newValue;
}


function App() {
    const [treeKeys, setTreeKeys] = useState(localStorage.getItem("treeKeys") === null ? [] : JSON.parse(localStorage.getItem("treeKeys")));
    return (
        <div className="App">
            {treeKeys.map((tree) => {
                return <ExpandCheckText
                    tree={tree}
                    onAddKey={
                        (value) => {
                            setTreeKeys(versatileChangeFile(treeKeys, value, tree));
                        }
                    }
                    onAdd={(value) => {
                        setTreeKeys(versatileChangeFile(treeKeys, value, tree));

                    }}
                    onExpand={(value) => {

                        setTreeKeys(versatileChangeFile(treeKeys, value, tree));
                    }
                    }
                    key={tree.id.toString()}

                    setIsCheck={(value) => {

                        setTreeKeys(versatileChangeFile(treeKeys, value, tree));

                    }}
                />;
            })}
        </div>
    );
}

function ExpandCheckText(props/*: { keys: any }*/) {
    return (
        <div className={"expandCheckText"} key={props.tree.id.toString()}>
            <IconView
                isCheck={props.tree.isExpanded}
                iconName={props.tree.isExpanded ? faAngleDown : faChevronRight}
                onClick={() => {
                    const value = props.tree;
                    value.isExpanded = !value.isExpanded;
                    props.onExpand(value);
                }
                }/>

            <CheckItem
                tree={props.tree}
                setIsCheck={props.setIsCheck}
                onExpand={(value) => {
                    const changedValue = props.tree.values.find((t) => t.id === value.id);

                    props.tree.values[props.tree.values.indexOf(changedValue)] = changedValue;

                    props.onExpand(props.tree);
                }
                }
                onAdd={(value) => {
                    props.onAdd(value);
                }}
                onAddKey={(value) => {
                    const changedValue = props.tree.values.find((t) => t.id === value.id);
                    props.tree.values[props.tree.values.indexOf(changedValue)] = changedValue;
                    props.onAddKey(props.tree);
                }}
            />

        </div>
    );

}

function IconView(props /*:{ isCheck: boolean, iconName: any }*/) {
    return <FontAwesomeIcon
        className="faicons"
        icon={props.iconName}
        onClick={props.onClick}
    />;
}

//{"id":111,"title":"abc-xyz-abc","isCheck":false,"add":true,"isExpanded":false,"values":[]}]}


function CheckItem(props/*: {title: string, isCheck: boolean}*/) {
    return (
        <div className={"checkItem"}>
            <div className={"checkItem-parent"}>

                <input type={"checkbox"} checked={props.tree.isCheck} onChange={() => {
                    const value = props.tree;
                    value.isCheck = !value.isCheck;
                    props.onExpand(value);
                }}/>

                <h1>{props.tree.title} </h1>

                {props.tree.add ? <div></div> :
                    <IconView isCheck={props.tree.isExpanded} iconName={faPlusCircle} onClick={() => {
                        const value = props.tree;
                        value.add = !value.add;
                        props.onAddKey(value);
                    }}/>}

            </div>

            <CreateNewKey tree={props.tree} onAdd={(value) => {
                let newKey = {
                    id: props.tree.id * 10 + props.tree.count + 1,
                    title: value,
                    isCheck: false,
                    count: 0,
                    add: false,
                    isExpanded: false,
                    values: []
                };

                props.tree.add = !props.tree.add;

                props.tree.count = props.tree.count + 1;

                props.tree.values.push(newKey);

                props.onAdd(props.tree);
            }}/>

            {ShouldReturnChild({
                tree: props.tree, setIsCheck: props.setIsCheck, onExpand: props.onExpand
                , onAddKey: props.onAddKey, onAdd: props.onAdd
            })}

        </div>
    );
}

class CreateNewKey extends React.Component {

    constructor(props) {
        super(props);
        this.state = {txt: 'Enter the Details '};

    }

    createText = (e) => {
        this.setState({txt: e.target.value});
    }


    render() {
        if (this.props.tree.add) {
            return <div>
                <input type={"text"} placeholder={this.state.txt} onChange={this.createText}/>
                <Button actionPerform={() => {
                    this.props.onAdd(this.state.txt);
                }} text={"add"}/>
            </div>;
        } else {
            return <div/>;
        }

    }


}

const Button = (props) => <button className={"titleField-button"} onClick={props.actionPerform}>{props.text}</button>

function ShouldReturnChild(props) {
    if (props.tree.isExpanded) {
        return (
            <div className={"expandedCheckText-childs"}>
                {props.tree.values.map((tree) => {
                    return <ExpandCheckText tree={tree} key={tree.id.toString()} onExpand={(id) => {
                        props.onExpand(id);
                    }} setIsCheck={(value) => {
                        props.setIsCheck(value);
                    }
                    } onAdd={(value) => {
                        props.onAdd(props.tree);
                    }} onAddKey={(value) => {
                        props.onAddKey(value);
                    }}/>;
                })}
            </div>
        );
    }
}

export default App;