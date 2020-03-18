import React from 'react';
import ReactDOM from 'react-dom';
import SchemeField from './components/SchemeField/SchemeField.js';
import VideoDrawing from './components/VideoDrawing/VideoDrawing.js';

ReactDOM.render((
    <div>
        <SchemeField width="1800"/>
        <VideoDrawing width="1800" height="900"/>
    </div>
    ), document.getElementById('root')
);