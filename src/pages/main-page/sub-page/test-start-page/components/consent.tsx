import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import JoditEditor from "jodit-react";
import { Context } from '../../../../..';
import MainCard from '../../../../../components/MainCard';



const Consent = observer(() => {

    const { settingsStore } = React.useContext(Context);
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("");

    function newContent2(props: any) {
        setContent(props)
    }

    React.useEffect(() => {

    }, []);

    return (
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
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
                    </>
                </MainCard>
            </div>
    );
})

export default Consent;

