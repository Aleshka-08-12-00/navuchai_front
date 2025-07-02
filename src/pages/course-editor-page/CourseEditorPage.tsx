import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CourseFormDialog, { CourseFormData } from '../../components/CourseFormDialog';
import { getModules, getLessons, getCourse, postCourse, putCourse, postModule, putModule, postLesson, putLesson } from '../../api';

const CourseEditorPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialData, setInitialData] = useState<CourseFormData | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).course) {
      setInitialData((location.state as any).course);
      if (courseId) setEditingId(Number(courseId));
      return;
    }
    if (!courseId) return;
    (async () => {
      try {
        const c = await getCourse(Number(courseId));
        const modulesData = await getModules(Number(courseId));
        const modulesWithLessons = await Promise.all(
          modulesData.map(async (m: any) => {
            const lessonsData = await getLessons(m.id);
            return { ...m, lessons: lessonsData };
          })
        );
        const formData: CourseFormData = {
          title: c.title,
          description: c.description || '',
          accessType: 'public',
          modules: modulesWithLessons.map((m: any) => ({
            id: m.id,
            title: m.title,
            lessons:
              m.lessons?.map((l: any) => ({
                id: l.id,
                title: l.title,
                content: l.content || '',
                video: l.video || '',
                image: l.image || '',
                imageId: l.img_id || null
              })) || []
          }))
        };
        setInitialData(formData);
        setEditingId(Number(courseId));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [courseId]);

  const handleSave = async (data: CourseFormData) => {
    try {
      let id = editingId;
      if (editingId) {
        await putCourse(editingId, { title: data.title, description: data.description, img_id: data.imageId });
      } else {
        const res = await postCourse({
          title: data.title,
          description: data.description,
          accessType: data.accessType,
          accessId: data.accessId,
          img_id: data.imageId,
          image: data.image
        });
        id = res?.id;
      }
      if (id) {
        const validModules = data.modules.filter((m) => m.title.trim());
        for (const mod of validModules) {
          let modId = mod.id;
          if (modId) {
            await putModule(modId, { title: mod.title });
          } else {
            const m = await postModule(id, { title: mod.title });
            modId = m?.id;
            if (!modId) {
              const modules = await getModules(id);
              const newModule = modules
                .filter((mm: any) => mm.title === mod.title)
                .sort((a: any, b: any) => (b.order || 0) - (a.order || 0))[0];
              modId = newModule?.id;
            }
          }
          if (modId) {
            const validLessons = (mod.lessons || []).filter((l) => l.title.trim());
            for (const les of validLessons) {
              const payload = {
                title: les.title,
                content: les.content,
                video: les.video,
                imgId: les.imageId
              };
              if (les.id) {
                await putLesson(les.id, payload);
              } else {
                console.log("lesson123");
                await postLesson(modId, payload);
              }
            }
          }
        }
      }
      navigate('/courses/');
    } catch (e) {
      console.error(e);
    }
  };

  return <CourseFormDialog open onClose={() => navigate('/courses/')} onSave={handleSave} course={initialData} />;
};

export default CourseEditorPage;
