import React, {useEffect, useState} from 'react';
import './App.css';
import {Layer, Rect, Stage} from "react-konva";
import {Html} from 'react-konva-utils';

const App = () => {
    const [annotations, setAnnotations] = useState<any>([
        {
            x: 200,
            y: 100,
            width: 200,
            height: 50,
            id: 1,
            text: 'test'
        }
    ]);
    const [newAnnotation, setNewAnnotation] = useState<any>([]);

    const handleMouseDown = (event: any) => {
        if (newAnnotation.length === 0) {
            const {x, y} = event.target.getStage().getPointerPosition();
            setNewAnnotation([{x, y, width: 0, height: 0, key: "0"}]);
        }
    };

    const handleMouseUp = (event: any) => {
        if (newAnnotation.length === 1) {
            const sx = newAnnotation[0].x;
            const sy = newAnnotation[0].y;
            const {x, y} = event.target.getStage().getPointerPosition();
            const annotationToAdd = {
                x: sx,
                y: sy,
                width: x - sx,
                height: y - sy,
                id: annotations.length + 1
            };
            annotations.push(annotationToAdd);
            setNewAnnotation([]);
            setAnnotations(annotations);
        }
    };

    const handleMouseMove = (event: any) => {
        if (newAnnotation.length === 1) {
            const sx = newAnnotation[0].x;
            const sy = newAnnotation[0].y;
            const {x, y} = event.target.getStage().getPointerPosition();
            setNewAnnotation([
                {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    id: "0"
                }
            ]);
        }
    };


    const menuNode = document.getElementById('menu');

    const menuClick = () => {
        //@ts-ignore
        menuNode.style.display = 'none';
    }

    const onInputEnter = (text: string, rect: any) => {
        console.log(text);
        console.log(rect);
    }

    const deleteRect = (id: number) => {
        setAnnotations(annotations.filter((item: any) => item.id !== id));
    }

    return (
        <div>
            <Stage
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                width={1200}
                height={1200}
            >
                <Layer>
                    {[...annotations, ...newAnnotation].map((value, index) => {
                        return (
                            <>
                                <Rect
                                    key={index}
                                    x={value.x}
                                    y={value.y}
                                    width={value.width}
                                    height={value.height}
                                    fill="rgba(255, 168, 0, 0.1)"
                                    stroke="rgba(255, 168, 0, 0.9)"
                                    dash={[6]}
                                    onClick={(e: any) => {
                                        e.evt.preventDefault();
                                        console.log(e.target);
                                        console.log(e.target._id);
                                        //@ts-ignore
                                        menuNode.style.display = 'initial';
                                        //@ts-ignore
                                        menuNode.style.top =
                                            value.y + 10 + 'px';
                                        //@ts-ignore
                                        menuNode.style.left =
                                            value.x + 10 + 'px';
                                    }}
                                />
                                <Html
                                    divProps={{
                                        style: {
                                            display: 'initial',
                                            position: 'absolute',
                                            top: value.y + 'px',
                                            left: value.x - 115 + 'px',
                                        },
                                    }}
                                >
                                    <Input onInputEnter={(text: string) => onInputEnter(text, value)}
                                           text={value.text}
                                           onDelete={() => deleteRect(value.id)}/>
                                </Html>
                            </>
                        );
                    })}

                </Layer>
            </Stage>
            <div id="menu">
                <button onClick={menuClick}>Menu 1</button>
                <button onClick={menuClick}>Menu 2</button>
                <button onClick={menuClick}>Menu 3</button>
            </div>
        </div>
    );
}

const Input = ({
                   onInputEnter,
                   onDelete,
                   text
               }: any) => {

    const [disable, setDisable] = useState<boolean>(false);

    const onKeyUp = (e: any) => {
        if (e.which === 13) {
            onInputEnter(e.target.value);
            setDisable(true);
        }
    }

    useEffect(() => {
        if (text) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [text]);

    return (
        <>
            <input onKeyUp={onKeyUp} style={{
                width: '100px'
            }} defaultValue={text} disabled={disable} placeholder="DOM input from Konva nodes"/>
            <span onClick={onDelete}>x</span>
        </>
    );
}

export default App;
