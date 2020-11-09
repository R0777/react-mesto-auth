import React from 'react';

const InfoTooltip = (props) => {

    return (
        <section className={`popup ${props.isTooltipOpen === true && 'active'}`} id={props.id}>
            <form className="popup__block" noValidate>
                <button className="popup__close" type="button" onClick={props.onClose}></button>
<div className={`popup__tooltip ${ props.id === 'accept' ? 'accept':'decline'}`} />
                <h4 className="popup__title-tooltip">{props.tooltipTitle}</h4>
            </form>
        </section>
    );
}

export default InfoTooltip;