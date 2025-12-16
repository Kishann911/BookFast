import './Card.css';

const Card = ({
    children,
    className = '',
    hoverable = false,
    onClick,
    ...props
}) => {
    return (
        <div
            className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
