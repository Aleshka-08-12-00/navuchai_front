import { Box, Button, Radio, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

import React, { useState } from "react";
import MainCard from "../../../components/MainCard";
import { Context } from "../../..";
import { Grid } from "@mui/material";
import logo from '../../../assets/images/logo.png';
import RecordingComponent from "../../main-page/sub-page/video-page";

const Example = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

const TestSingleChoiceCard = observer(() => {
  const { settingsStore } = React.useContext(Context);
  const [startVideoOne, setStartVideoOne] = useState(true);
  const [startVideoTwo, setStartVideoTwo] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Индекс текущего вопроса

  // Получаем текущий вопрос на основе индекса
  const obj = settingsStore.questionsObj[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < settingsStore.questionsObj.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Переход к следующему вопросу
    } else {
      alert("Тест завершен!"); // Действие, если вопросы закончились
    }
  };

  return (
    <>
      <div style={{ background: 'white', height: 100 }}>
        <div>
          <img alt="logo" src={logo} style={{ width: 200, padding: 20 }} />
        </div>
      </div>

      <Box
        sx={{
          marginTop: 2,
          marginLeft: 1,
          marginRight: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto',
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
              <>
                <div style={{ display: 'flex', margin: 'auto', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5">
                      №
                      {obj.position} / {settingsStore.questionsObj.length}
                    </Typography>
                  </span>
                </div>
                <Stack
                  sx={{ mt: 2, mb: 2, ml: 5 }}
                  style={!startVideoOne || !startVideoTwo ? { filter: 'blur(5px)' } : {}}
                >
                  <Example htmlContent={obj.body} />
                  {obj.answerConfiguration.answers &&
                    obj.answerConfiguration.answers.map((item: any, index: number) => (
                      <div
                        key={index}
                        style={
                          item.correct
                            ? { backgroundColor: '#e5ffea', borderRadius: 10 }
                            : { borderRadius: 10 }
                        }
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Radio
                            checked={false}
                            disabled={true}
                            name="single-choice-group"
                            style={{
                              outline: 'none',
                              boxShadow: 'none',
                              marginTop: 3,
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                            }}
                          />
                          <Example htmlContent={item.body} />
                        </div>
                      </div>
                    ))}
                </Stack>
                <Button
                  disabled={!startVideoOne || !startVideoTwo}
                  variant="outlined"
                  color="success"
                  onClick={handleNextQuestion} // Переход к следующему вопросу
                >
                  Следующий вопрос
                </Button>
              </>
            </MainCard>
          </Grid>
        </Grid>
      </Box>
      <div style={{ display: 'table', margin: 'auto' }}>
        <RecordingComponent
          startVideoOne={startVideoOne}
          startVideoTwo={startVideoTwo}
          setStartVideoOne={setStartVideoOne}
          setStartVideoTwo={setStartVideoTwo}
        />
      </div>
    </>
  );
});

export default TestSingleChoiceCard;
