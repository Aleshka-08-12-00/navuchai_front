import { Button, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';

const RecordingComponent = ({ startVideoOne, startVideoTwo, setStartVideoOne, setStartVideoTwo }: any) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [screenRecorder, setScreenRecorder] = useState<MediaRecorder | null>(null);
    const [cameraRecorder, setCameraRecorder] = useState<MediaRecorder | null>(null);
    const [screenChunks, setScreenChunks] = useState<Blob[]>([]);
    const [cameraChunks, setCameraChunks] = useState<Blob[]>([]);

    // Start screen recording
    const startScreenRecording = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const recorder = new MediaRecorder(screenStream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = () => {
                setScreenChunks(chunks);
                downloadRecording(chunks, 'screen-recording.webm');
            };

            recorder.start();
            setScreenRecorder(recorder);
            setStartVideoOne(!startVideoOne)
        } catch (error) {
            console.error('Error starting screen recording:', error);
        }
    };

    // Start camera recording
    const startCameraRecording = async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = cameraStream;
            }
            const recorder = new MediaRecorder(cameraStream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = () => {
                setCameraChunks(chunks);
                downloadRecording(chunks, 'camera-recording.webm');
            };

            recorder.start();
            setCameraRecorder(recorder);
            setStartVideoTwo(!startVideoTwo)
        } catch (error) {
            console.error('Error starting camera recording:', error);
        }
    };

    // Stop all recordings
    const stopRecording = () => {
        if (screenRecorder) {
            screenRecorder.stop();
        }
        if (cameraRecorder) {
            cameraRecorder.stop();
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
        }
    };

    // Helper function to download recordings
    const downloadRecording = (chunks: Blob[], filename: string) => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    return (
        <div>
            <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center' }} >
                Перед начом теста нажмите 'Начать запись экрана' и 'Начать запись камеры'
            </Typography>
            <div style={{ padding: 10, display: 'grid', alignItems: 'center', margin: 'auto', justifyContent: 'space-around' }}>
                <Button variant='outlined' color='success' size="large" onClick={startScreenRecording} style={{ marginRight: 10, textTransform: 'none', width: 350, marginBottom: 10 }}>Начать запись экрана</Button>
                <Button variant='outlined' color='success' size="large" onClick={startCameraRecording} style={{ marginRight: 10, textTransform: 'none', width: 350, marginBottom: 10 }}>Начать запись камеры</Button>
                <Button variant='outlined' color='error' size="large" onClick={stopRecording} style={{ marginRight: 10, textTransform: 'none', width: 350, marginBottom: 10 }}> Остановить запись</Button>
            </div>
            <video ref={videoRef} autoPlay style={{
                width: '350px',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                margin: 'auto',
                justifyContent: 'center',
            }}></video>

        </div>
    );
};

export default RecordingComponent;
