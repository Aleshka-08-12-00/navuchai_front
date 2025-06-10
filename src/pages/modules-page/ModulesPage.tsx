import React, { useEffect, useState } from 'react';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getModules } from 'api';

const ModulesPage = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const m = await getModules(Number(courseId));
        setModules(m);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [courseId]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Модули курса
      </Typography>
      <List>
        {modules.map((m) => (
          <ListItemButton
            key={m.id}
            onClick={() => navigate(`/courses/${courseId}/modules/${m.id}/lessons`)}
          >
            <ListItemText primary={m.title} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ModulesPage;
