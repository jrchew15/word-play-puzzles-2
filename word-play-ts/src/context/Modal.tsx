import React, { useContext, useRef, useState, useEffect, MouseEventHandler, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = React.createContext(null);

export function ModalProvider(props: PropsWithChildren) {

    const modalRef = useRef(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(modalRef.current);
    }, [])

    return (
        <>
            <ModalContext.Provider value={value}>
                {props.children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    )
}

export function Modal(props: PropsWithChildren & { onClose: MouseEventHandler }) {
    const modalNode = useContext(ModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={props.onClose} />
            <div id="modal-content">
                {props.children}
            </div>
        </div>,
        modalNode
    );
}
