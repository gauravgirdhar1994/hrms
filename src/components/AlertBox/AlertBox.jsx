import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogLabel,
    AlertDialogDescription,
    AlertDialogOverlay,
    AlertDialogContent,
} from "@reach/alert-dialog";
//import "@reach/dialog/styles.css";
import "./alert-box.css";
import { Modal, Button, Form } from "react-bootstrap";
export default function AlertBox(props) {
    const [showDialog, setShowDialog] = React.useState(true);
    const cancelRef = React.useRef();
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);
    return (
        <div>
            {showDialog && (
                <AlertDialog leastDestructiveRef={cancelRef}>
                    <AlertDialogLabel>Alert Message</AlertDialogLabel>
                    <AlertDialogDescription className="alert-message">
                        {props.showDialogMessage}
                    </AlertDialogDescription>
                    <div className="alert-buttons">
                        {/* <Button variant="secondary" onClick={close}>Yes, delete</Button>{" "} */}
                        <Button variant="primary" ref={cancelRef} onClick={close}>
                            Close
                        </Button>
                    </div>
                </AlertDialog>
            )}
        </div>
    );
}