import React, {Component} from 'react';
import ReactDom from 'react-dom';
import io from 'socket.io-client';
import './Canvas.css'

class CanvasComponent extends Component {

    constructor(props) {
        super();
        this.state = {
            prevX: 0,
            prevY: 0,
            currX: 0,
            currY: 0,
            drawing: false,
            strokeColor: props.strokeColor
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        //this.socket = io('localhost:8080');
        this.socket = io(window.location.hostname + ':' + window.location.port);
    }

    componentDidMount() {
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.addEventListeners();
        this.socket.on('mousedown', (data) => {
            this.setState({
                prevX: data.prevX,
                prevY: data.prevY,
                currX: data.prevX,
                currY: data.prevY,
                drawing: true,
                strokeColor: data.strokeColor
            })
        });
        this.socket.on('mousemove', (data) => {
            this.setState({
                currX: data.currX,
                currY: data.currY,
                strokeColor: data.strokeColor
            });
            this.setState({
                prevY: data.currY,
                prevX: data.currX
            });
        });
        this.socket.on('mouseup', (data) => {
            this.setState({
                prevX: data.currX,
                prevY: data.currY,
                drawing: false,
                strokeColor: data.strokeColor
            });
        });
    }

    componentWillUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = this.ctx;
        const {prevX, prevY, currX, currY,strokeColor} = this.state;
        ctx.beginPath();
        ctx.moveTo(prevX,prevY);
        ctx.lineTo(currX,currY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.closePath();
    }

    onMouseDown(e) {
        if ( !ReactDom.findDOMNode(this).contains(e.target) ) { return; }
            e.preventDefault();
        const canvas = this.canvas;
        let prevX = e.clientX - canvas.offsetLeft;
        let prevY = e.clientY - canvas.offsetTop;
        this.socket.emit('mousedown', {
            prevX: prevX,
            prevY: prevY,
            strokeColor: this.props.strokeColor
        });
    }

    onMouseMove(e) {
        e.preventDefault();
        if ( !this.state.drawing ) return;
        const canvas = this.canvas;
        let currX = e.clientX - canvas.offsetLeft;
        let currY = e.clientY - canvas.offsetTop;
        this.socket.emit('mousemove', {
            prevX: this.state.prevX,
            prevY: this.state.prevY,
            currX: currX,
            currY: currY,
            strokeColor: this.props.strokeColor
        });
    }

    onMouseUp(e) {
        e.preventDefault();
        this.socket.emit('mouseup', {
            currX: this.state.currX,
            currY: this.state.currY,
            strokeColor: this.props.strokeColor
        });
    }

    addEventListeners() {
        document.addEventListener("mousedown", this.onMouseDown, false);
        document.addEventListener("mouseup",this.onMouseUp,false);
        document.addEventListener("mousemove", this.onMouseMove, false);
    }

    render() {
        return (
            <canvas className="canvas"
                    ref = "canvas" width={500} height={500} />
        )
    }

}

export default CanvasComponent