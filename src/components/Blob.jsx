//import Spline from '@splinetool/react-spline';

import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

const Component = () => app.load('https://prod.spline.design/1vcGr0ORyCbons11/scene.splinecode');
const Blob = () => {
    return (
       <Component />
    )
};

export default Blob;