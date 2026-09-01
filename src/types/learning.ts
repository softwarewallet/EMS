export type CourseLifecycleStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
export type OfferingStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type TeachingRole = 'PRIMARY_TEACHER' | 'CO_TEACHER' | 'TEACHING_ASSISTANT' | 'SUBSTITUTE_TEACHER';
export type DeliveryMode = 'ONLINE' | 'HYBRID' | 'IN_PERSON' | 'SELF_PACED';
export type ContentVisibility = 'PUBLIC' | 'ENROLLED_ONLY' | 'TEACHERS_ONLY' | 'HIDDEN';
export type LearningResourceType = 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'PRESENTATION' | 'LINK' | 'NOTE' | 'CODE_LAB';

export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
export type SubmissionStatus = 'SUBMITTED' | 'LATE_SUBMITTED' | 'GRADED' | 'RETURNED' | 'RESUBMITTED';

export type QuestionType = 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'DESCRIPTIVE' | 'NUMERICAL';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type AttemptStatus = 'STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FINALIZED';

export type DiscussionStatus = 'ACTIVE' | 'LOCKED' | 'ARCHIVED';
export type ModerationState = 'APPROVED' | 'FLAGGED' | 'HIDDEN';

export interface LearningCourse {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string; // e.g. "CS101"
  title: string;
  description: string;
  subjectId?: string;
  departmentId?: string;
  departmentName?: string;
  credits?: number;
  currentVersion: number;
  status: CourseLifecycleStatus;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningCourseVersion {
  id: string;
  tenantId: string;
  courseId: string;
  versionNumber: number;
  syllabusOverview: string;
  learningObjectives: string[];
  prerequisites?: string[];
  status: CourseLifecycleStatus;
  publishedAt?: string;
  publishedById?: string;
  publishedByName?: string;
  createdAt: string;
}

export interface CourseOffering {
  id: string;
  tenantId: string;
  campusId?: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  academicYearId: string;
  academicYearName: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  subjectId: string;
  subjectName: string;
  deliveryMode: DeliveryMode;
  status: OfferingStatus;
  startDate: string;
  endDate: string;
  capacity?: number;
  primaryTeacherId?: string;
  primaryTeacherName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseTeachingAssignment {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  teacherId: string; // References authoritative Staff/Teacher ID
  teacherName: string;
  teacherEmail: string;
  role: TeachingRole;
  assignedAt: string;
  assignedById: string;
  assignedByName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface LearningUnit {
  id: string;
  tenantId: string;
  courseId: string;
  courseVersionId: string;
  courseOfferingId?: string;
  title: string;
  summary: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningLesson {
  id: string;
  tenantId: string;
  unitId: string;
  courseId: string;
  title: string;
  contentBody: string;
  durationMinutes: number;
  sortOrder: number;
  visibility: ContentVisibility;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningResource {
  id: string;
  tenantId: string;
  lessonId?: string;
  unitId?: string;
  courseId: string;
  title: string;
  type: LearningResourceType;
  externalUrl?: string;
  documentId?: string; // References authoritative Document Registry ID
  fileSizeKb?: number;
  version: number;
  visibility: ContentVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface LearningResourceVersion {
  id: string;
  tenantId: string;
  resourceId: string;
  versionNumber: number;
  documentId?: string;
  externalUrl?: string;
  changeSummary: string;
  createdBy: string;
  createdAt: string;
}

export interface DigitalLearningContent {
  id: string;
  tenantId: string;
  courseId: string;
  title: string;
  contentType: LearningResourceType;
  fileOrUrlReference: string;
  documentRegistryId?: string;
  version: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningActivity {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  studentId: string;
  studentName: string;
  activityType: 'LESSON_VIEW' | 'ASSIGNMENT_SUBMITTED' | 'QUIZ_ATTEMPTED' | 'DISCUSSION_POSTED';
  targetId: string;
  description: string;
  timestamp: string;
}

export interface LearningAssignment {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  title: string;
  instructions: string;
  maxMarks: number;
  dueDate: string;
  allowLateSubmissions: boolean;
  latePenaltyPercentage?: number;
  rubricNotes?: string;
  attachmentDocumentIds?: string[];
  status: AssignmentStatus;
  createdById: string;
  createdByName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningAssignmentSubmission {
  id: string;
  tenantId: string;
  campusId?: string;
  assignmentId: string;
  courseOfferingId: string;
  studentId: string; // References authoritative Student ID
  studentName: string;
  studentRollNumber?: string;
  enrollmentId?: string;
  submissionText?: string;
  attachmentDocumentIds?: string[];
  submittedAt: string;
  status: SubmissionStatus;
  obtainedMarks?: number;
  feedback?: string;
  gradedById?: string;
  gradedByName?: string;
  gradedAt?: string;
  updatedAt: string;
}

export interface LearningQuestionBank {
  id: string;
  tenantId: string;
  subjectId?: string;
  subjectName?: string;
  title: string;
  description: string;
  totalQuestionsCount: number;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningQuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean; // Must NEVER be sent to student during active quiz attempt
}

export interface LearningQuestion {
  id: string;
  tenantId: string;
  questionBankId: string;
  type: QuestionType;
  prompt: string;
  options?: LearningQuestionOption[];
  correctAnswerText?: string; // For short answer / descriptive / numerical
  explanation?: string;
  difficulty: DifficultyLevel;
  marks: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningQuiz {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  title: string;
  instructions: string;
  questionIds: string[];
  totalMarks: number;
  durationMinutes: number;
  timeLimitEnforced: boolean;
  passingPercentage: number;
  status: QuizStatus;
  publishedAt?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentQuizAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  answerText?: string;
  obtainedMarks?: number;
  isCorrect?: boolean;
}

export interface LearningAssessmentAttempt {
  id: string;
  tenantId: string;
  campusId?: string;
  quizId: string;
  courseOfferingId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  durationSecondsUsed?: number;
  answers: StudentQuizAnswer[];
  totalMarksObtained?: number;
  percentageScore?: number;
  isPassed?: boolean;
  status: AttemptStatus;
  evaluatedById?: string;
  evaluatedAt?: string;
  updatedAt: string;
}

export interface LearningGradeRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  studentId: string;
  studentName: string;
  assessmentType: 'ASSIGNMENT' | 'QUIZ' | 'FORMATIVE_TASK' | 'PROJECT';
  assessmentId: string;
  assessmentTitle: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  gradeLetter?: string;
  feedback?: string;
  isFinalized: boolean;
  gradedById: string;
  gradedByName: string;
  gradedAt: string;
  updatedAt: string;
}

export interface LearningDiscussion {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  topicTitle: string;
  initialPost: string;
  authorId: string;
  authorName: string;
  authorRole: 'TEACHER' | 'STUDENT' | 'ADMIN';
  status: DiscussionStatus;
  messageCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningDiscussionMessage {
  id: string;
  tenantId: string;
  discussionId: string;
  courseOfferingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'TEACHER' | 'STUDENT' | 'ADMIN';
  messageText: string;
  moderationState: ModerationState;
  moderatedById?: string;
  moderatedAt?: string;
  createdAt: string;
}

export interface LearningAnnouncement {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  title: string;
  body: string;
  publisherId: string;
  publisherName: string;
  communicationMessageId?: string; // Links to Phase 7.14 Communications
  createdAt: string;
}

export interface LearningStudentProgress {
  id: string;
  tenantId: string;
  courseOfferingId: string;
  studentId: string;
  studentName: string;
  completedLessonIds: string[];
  submittedAssignmentIds: string[];
  completedQuizIds: string[];
  lessonsCompletionPercentage: number;
  assignmentsCompletionPercentage: number;
  quizzesCompletionPercentage: number;
  overallProgressPercentage: number;
  isCourseCompleted: boolean;
  completedAt?: string;
  lastActivityAt: string;
  updatedAt: string;
}

export interface LearningCourseCompletion {
  id: string;
  tenantId: string;
  campusId?: string;
  courseOfferingId: string;
  courseCode: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  completionDate: string;
  finalPercentage: number;
  issuedById: string;
  issuedByName: string;
  certificateDocumentId?: string;
  createdAt: string;
}

export interface LearningContentAccessEvent {
  id: string;
  tenantId: string;
  studentId: string;
  resourceId: string;
  lessonId?: string;
  courseOfferingId: string;
  accessedAt: string;
}

export interface LearningAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  totalActiveCourses: number;
  totalActiveOfferings: number;
  totalEnrolledLearners: number;
  totalAssignmentsSubmitted: number;
  totalQuizzesEvaluated: number;
  averageCourseCompletionRate: number;
  averageFormativePerformance: number;
  lastUpdated: string;
}

export interface FilterLearningCourseParams {
  departmentId?: string;
  status?: CourseLifecycleStatus;
  searchQuery?: string;
}

export interface FilterCourseOfferingParams {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  status?: OfferingStatus;
  searchQuery?: string;
}
