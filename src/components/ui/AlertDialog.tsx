import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface AlertDialogProps {
    title: string;
    message: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAgree?: () => void;
    onDisagree?: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    title,
    message,
    open,
    setOpen,
    onAgree,
    onDisagree,
}) => {

    const handleClose = (action: "agree" | "disagree") => {
        setOpen(false);
        if (action === "agree" && onAgree) onAgree();
        if (action === "disagree" && onDisagree) onDisagree();
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose("disagree")}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            role="alertdialog"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose("disagree")} autoFocus>
                    Đóng
                </Button>
                <Button onClick={() => handleClose("agree")}>Vào</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;