import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import JoditEditor from "jodit-react";
import { Context } from '../../../../..';
import MainCard from '../../../../../components/MainCard';
import { Button, Snackbar, Alert } from '@mui/material';



const Consent = observer(() => {

    const { settingsStore } = React.useContext(Context);
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("");
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

    function newContent2(props: any) {
        setContent(props)
    }

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    React.useEffect(() => {

    }, []);

    return (
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 , opacity: 0.1}}>
                    <>
                        <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}   >
                            Согласие
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }} >
                            Если для прохождения теста требуется согласие или одобрение респондентов, укажите это ниже.
                        </Typography>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            // config={config}
                            onBlur={(newContent) => newContent2(newContent)}
                        />
                        <Button
                            variant='contained'
                            color='success'
                            style={{ textTransform: 'none', marginTop: 20 }}
                            onClick={() => showAlert('Согласие успешно сохранено', 'success')}
                        >
                            Сохранить
                        </Button>
                    </>
                </MainCard>
                <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </div>
    );
})

export default Consent;

