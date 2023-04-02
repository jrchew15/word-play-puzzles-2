import { useState, useRef, useEffect, SetStateAction, Dispatch, DragEventHandler, ChangeEventHandler } from "react";
import './dragDrop.css';

export default function ImageDragAndDrop(props: { imageFile: null | File, setImageFile: Dispatch<SetStateAction<null | File>> }) {
    const { imageFile, setImageFile } = props;
    const [imageUrl, setImageUrl] = useState<string>('');
    const [dragging, setDragging] = useState<boolean>(false);    // used to give user feedback when they are dragging a file correctly
    const [imageError, setImageError] = useState<string>('');
    const addFileRef = useRef<null | HTMLInputElement>(null); // used to trigger file explorer

    // Event handlers
    const dragOverHandler: DragEventHandler = (e) => {
        e.preventDefault()
        setDragging(true)
    }
    const dragLeaveHandler: DragEventHandler = (e) => {
        e.preventDefault()
        const related = e.relatedTarget as HTMLElement;
        if (e.currentTarget.id === 'drag-container' && related.id !== 'drag-border') {
            setDragging(false);
        }
    }
    const dropHandler: DragEventHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.target) {
            console.log(e.target, e.currentTarget, e)
        }
        if (e.dataTransfer.items && e.dataTransfer.items[0]) {
            let file = e.dataTransfer.items[0].getAsFile() as File
            if (file.size > 1e6) {
                setImageError('Image file must be less than 1MB in size')
            } else {
                setImageFile(file)
            }
        }
        setDragging(false);
    }
    const fileInputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget && e.currentTarget.files) {
            if (e.currentTarget.files[0] && e.currentTarget.files[0].size > 1e6) {
                setImageError('Image file must be less than 1MB in size')
            } else {
                setImageFile(e.currentTarget.files[0])
            }
        }
    }

    // when receiving a new file, create url for it to display
    useEffect(() => {
        if (imageFile) {
            setImageError('')
            setImageUrl(URL.createObjectURL(imageFile))
        }
    }, [imageFile])

    return <div id='drag-container'
        onDragLeave={dragLeaveHandler}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
        onClick={(e) => {
            if (addFileRef.current) {
                addFileRef.current.click()
            }
        }}
        className={dragging ? 'dragging' : ''}
    >
        {imageFile ?
            <img src={imageUrl} alt={'uploaded_file'} onDrop={dropHandler} />
            : // placeholder when no image
            <div id='drag-border' onDrop={dropHandler}>
                <i className='far fa-file-image' />
            </div>}
        {/* hidden input element to receive file */}
        <input
            ref={addFileRef}
            type='file'
            id='hidden-file-input'
            onChange={fileInputChangeHandler}
        />
        <span style={{ left: 0, top: 0, fontSize: '1.3em' }}>Profile Picture (optional)</span>
        <span style={{ right: 0, bottom: 0 }}>Drag an image file or click</span>
        {imageError && <span style={{ right: '35%', bottom: 50, color: 'red' }}>{imageError}</span>}
    </div>
}
