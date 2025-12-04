import ExamManagement from '../admin/ExamManagement';
import { useUserStore } from '../../store/userStore';

export default function TeacherExamManagement() {
  const { user } = useUserStore();

  if (!user) {
    return <div>ابتدا باید وارد شوید.</div>;
  }

  return <ExamManagement teacherId={user.id} />;
}
