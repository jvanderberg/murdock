
import register from 'preact-custom-element';


const CardComponent = ({ title, description }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    )
}

register(CardComponent, 'x-card', ['title', 'description'], { shadow: true });


