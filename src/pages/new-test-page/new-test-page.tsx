import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import ContentPage from "../main-page/content-page";


const NewTestPage = observer(() => {

    const [testId, setTestId] = useState(0);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}> 
        <ContentPage testId={testId}/>
      </Box>
    </>
  )
});
export default NewTestPage;
