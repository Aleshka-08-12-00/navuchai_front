import React, { useRef, useState } from 'react';

const RecordingComponent: React.FC = () => {
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
            <h2>Screen and Camera Recorder</h2>
            <video ref={videoRef} autoPlay style={{ width: '400px', height: '300px', marginBottom: '20px' }}></video>
            <div>
                <button onClick={startScreenRecording}>Start Screen Recording</button>
                <button onClick={startCameraRecording}>Start Camera Recording</button>
                <button onClick={stopRecording}>Stop Recording</button>
            </div>
        </div>
    );
};

export default RecordingComponent;
