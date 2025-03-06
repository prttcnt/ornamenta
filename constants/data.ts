import icons from "./icons";
import images from "./images";

export interface Slide {
    id: string;
    title: string;
    description: string;
    image: any;
}

const slides: Slide[] = [
    {
        id: '1',
        title: '1 title',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
        image: images.grid,
    },
    {
        id: '2',
        title: '2 title',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
        image: images.grid,
    },
    {
        id: '3',
        title: '3 title',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
        image: images.grid,
    }
]

export default slides
