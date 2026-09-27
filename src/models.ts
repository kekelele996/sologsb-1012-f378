export type CourseStatus = 'draft' | 'review' | 'changes' | 'frozen';
export type Difficulty = '入门' | '进阶' | '挑战';
export type CameraAngle = '正面' | '左侧 45°' | '右侧 45°' | '俯拍手部' | '全身远景';
export type CaptionPosition = '下方安全区' | '上移 15%' | '角标提示' | '画面中央';
export type GestureZone = '左侧' | '中央' | '右侧';

export interface LessonStep {
  id: string;
  title: string;
  kind: '示范' | '讲解' | '练习';
  duration: number;
  demoTitle: string;
  demoUrl: string;
  handshape: string;
  gestureZone: GestureZone;
  caption: string;
  captionPosition: CaptionPosition;
  camera: CameraAngle;
  commonMistakes: string[];
  exercise: string;
  exerciseFeedback: string;
  altText: string;
  prerequisiteId: string;
  difficulty: Difficulty;
  cuePoints: number[];
  fixTickets?: FixTicket[];
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  color: string;
  steps: LessonStep[];
  fixTickets?: FixTicket[];
}

export interface FrozenVersion {
  id: string;
  label: string;
  createdAt: string;
  snapshot: Omit<CourseProject, 'frozenVersions'>;
}

export interface CourseProject {
  id: string;
  title: string;
  teacher: string;
  audience: string;
  status: CourseStatus;
  selectedModuleId: string;
  selectedStepId: string;
  modules: CourseModule[];
  frozenVersions: FrozenVersion[];
  fixTickets?: FixTicket[];
  lastSavedAt: string;
  revision: number;
}

export interface ValidationCheck {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  detail: string;
  stepId?: string;
  moduleId?: string;
}

export type FixTicketStatus = 'open' | 'fixed';

export interface FixTicketSnapshot {
  owner: string;
  note: string;
  recheckAt: string;
}

export interface FixTicketHistoryEntry {
  at: string;
  type: 'created' | 'updated' | 'fixed' | 'reopened';
  reason?: string;
  snapshot: FixTicketSnapshot;
}

export interface FixTicket extends FixTicketSnapshot {
  /** 与对应阻断检查 ValidationCheck.id 保持一致，用于复发对账 */
  checkId: string;
  severity: 'error';
  title: string;
  detail: string;
  stepId?: string;
  moduleId?: string;
  status: FixTicketStatus;
  createdAt: string;
  updatedAt: string;
  /** 复发次数：问题修正后再次出现时累加 */
  recurrenceCount: number;
  history: FixTicketHistoryEntry[];
}

export interface FixTicketView extends FixTicket {
  moduleId?: string;
  stepId?: string;
  /** 当前检查结果中该问题是否仍存在 */
  active: boolean;
}

export const STORAGE_KEY = 'sologsb-1012-sign-course-project-v1';

export function createDemoProject(): CourseProject {
  const modules: CourseModule[] = [
    {
      id: 'module-1',
      title: '模块一 · 日常问候',
      summary: '建立手形、视线和面部表情之间的配合，完成三个基础问候。',
      color: '#15827a',
      steps: [
        {
          id: 'step-1-1',
          title: '观察“你好”的完整动作',
          kind: '示范',
          duration: 35,
          demoTitle: '你好 · 正面慢速示范',
          demoUrl: '',
          handshape: '右手掌张开，拇指向上，自额头向外送出',
          gestureZone: '右侧',
          caption: '你好：手掌从额前向前送出，同时保持微笑。',
          captionPosition: '下方安全区',
          camera: '正面',
          commonMistakes: ['手掌过于僵硬', '没有视线交流'],
          exercise: '跟随示范完成两次，每次保持两秒。',
          exerciseFeedback: '镜面检查手掌高度是否与眉线一致。',
          altText: '教师面向镜头，用右手掌从额头向前送出，并点头微笑。',
          prerequisiteId: '',
          difficulty: '入门',
          cuePoints: [4, 16, 28],
        },
        {
          id: 'step-1-2',
          title: '拆解“你好”的手形',
          kind: '讲解',
          duration: 50,
          demoTitle: '你好 · 手部近景',
          demoUrl: '',
          handshape: '四指并拢，拇指张开；掌心朝左前侧',
          gestureZone: '中央',
          caption: '注意四指并拢，动作沿身体中轴向前。',
          captionPosition: '画面中央',
          camera: '俯拍手部',
          commonMistakes: ['拇指贴住掌心', '动作方向偏向一侧'],
          exercise: '固定肩部，只移动前臂完成五次。',
          exerciseFeedback: '如果动作跑偏，先在镜前标记起点和终点。',
          altText: '手部近景展示四指并拢、拇指张开的起始手形。',
          prerequisiteId: 'step-1-1',
          difficulty: '入门',
          cuePoints: [6, 24, 42],
        },
        {
          id: 'step-1-3',
          title: '双人问候练习',
          kind: '练习',
          duration: 75,
          demoTitle: '你好 · 双人轮流练习',
          demoUrl: '',
          handshape: '保持标准手形，配合点头与视线交换',
          gestureZone: '中央',
          caption: '轮流问候，每次动作结束后停一拍，再交换角色。',
          captionPosition: '上移 15%',
          camera: '全身远景',
          commonMistakes: ['动作过早结束', '两人视线没有相遇'],
          exercise: '两人一组轮流完成问候，交换三次。',
          exerciseFeedback: '同伴负责确认视线和动作停顿。',
          altText: '两名学习者相对站立，交替做出问候动作并看向对方。',
          prerequisiteId: 'step-1-2',
          difficulty: '进阶',
          cuePoints: [10, 34, 57],
        },
      ],
    },
    {
      id: 'module-2',
      title: '模块二 · 数量表达',
      summary: '用数字、空间位置和顺序词完成价格询问。',
      color: '#8a3ffc',
      steps: [
        {
          id: 'step-2-1',
          title: '数字一到五的稳定手形',
          kind: '讲解',
          duration: 60,
          demoTitle: '数字 1—5 · 镜面视图',
          demoUrl: '',
          handshape: '食指到五指依次展开，手心朝前',
          gestureZone: '中央',
          caption: '数字一到五：从食指开始依次增加，不移动手腕。',
          captionPosition: '下方安全区',
          camera: '正面',
          commonMistakes: ['拇指遮挡手指数', '手腕左右摆动'],
          exercise: '按随机口令连续展示 1—5。',
          exerciseFeedback: '每个数字保持一秒，同伴随机报数。',
          altText: '教师手心朝前，依次伸出食指到五指，展示数字一到五。',
          prerequisiteId: '',
          difficulty: '入门',
          cuePoints: [8, 26, 44],
        },
        {
          id: 'step-2-2',
          title: '组合成“多少钱”',
          kind: '示范',
          duration: 45,
          demoTitle: '多少钱 · 双手组合动作',
          demoUrl: '',
          handshape: '双手在胸前交替翻转，随后食指向前点出',
          gestureZone: '中央',
          caption: '先做“钱”的交替手形，再用食指向前询问。',
          captionPosition: '角标提示',
          camera: '右侧 45°',
          commonMistakes: ['两手动作不同步', '疑问表情缺失'],
          exercise: '配合疑问表情完成三次询问。',
          exerciseFeedback: '录下动作，检查双手是否在胸前同一高度。',
          altText: '教师双手机械交替翻转后，食指朝前点出并抬眉疑问。',
          prerequisiteId: 'step-2-1',
          difficulty: '进阶',
          cuePoints: [5, 22, 37],
        },
      ],
    },
  ];

  return {
    id: 'sign-course-project',
    title: '零基础手语 · 问候与数量',
    teacher: '陈老师 / 特殊教育中心',
    audience: '初次接触手语的初中学习者',
    status: 'draft',
    selectedModuleId: 'module-1',
    selectedStepId: 'step-1-2',
    modules,
    frozenVersions: [],
    lastSavedAt: new Date().toISOString(),
    revision: 1,
  };
}

export function selectedModule(project: CourseProject): CourseModule {
  return project.modules.find((module) => module.id === project.selectedModuleId) ?? project.modules[0];
}

export function selectedStep(project: CourseProject): LessonStep | undefined {
  const module = selectedModule(project);
  return module?.steps.find((step) => step.id === project.selectedStepId) ?? module?.steps[0];
}

export function validateProject(project: CourseProject): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  if (!project.title.trim()) checks.push({ id: 'title', severity: 'error', title: '课程标题缺失', detail: '发布前需要为课程填写清晰标题。' });
  if (project.modules.length === 0) checks.push({ id: 'modules', severity: 'error', title: '没有课程模块', detail: '至少需要创建一个包含学习步骤的模块。' });

  project.modules.forEach((module) => {
    if (!module.steps.length) {
      checks.push({ id: `empty-${module.id}`, severity: 'error', title: `${module.title} 没有学习步骤`, detail: '空模块无法进入复核。', moduleId: module.id });
    }
    module.steps.forEach((step, index) => {
      if (!step.altText.trim()) {
        checks.push({ id: `alt-${step.id}`, severity: 'error', title: `${step.title} 缺少替代文本`, detail: '示范片段需要描述手形、移动和面部表情。', stepId: step.id, moduleId: module.id });
      }
      if (!step.caption.trim()) {
        checks.push({ id: `caption-${step.id}`, severity: 'warning', title: `${step.title} 缺少字幕`, detail: '听障学习者在静音预览时无法获得说明。', stepId: step.id, moduleId: module.id });
      }
      if (step.captionPosition === '画面中央' && (step.gestureZone === '中央' || step.camera === '俯拍手部')) {
        checks.push({ id: `overlap-${step.id}`, severity: 'error', title: `${step.title} 字幕可能遮挡动作`, detail: `字幕位于${step.captionPosition}，而主要手形位于${step.gestureZone}。`, stepId: step.id, moduleId: module.id });
      }
      if (step.duration < 20) {
        checks.push({ id: `duration-${step.id}`, severity: 'warning', title: `${step.title} 时长过短`, detail: '示范与练习不足 20 秒，学习者来不及观察和跟做。', stepId: step.id, moduleId: module.id });
      }
      if (step.prerequisiteId) {
        const prerequisiteIndex = module.steps.findIndex((candidate) => candidate.id === step.prerequisiteId);
        if (prerequisiteIndex < 0) {
          checks.push({ id: `missing-pre-${step.id}`, severity: 'error', title: `${step.title} 的前置步骤不存在`, detail: '请重新选择前置条件或移除依赖。', stepId: step.id, moduleId: module.id });
        } else if (prerequisiteIndex >= index) {
          checks.push({ id: `jump-${step.id}`, severity: 'error', title: `${step.title} 出现步骤跳级`, detail: '前置步骤位于当前步骤之后，学习顺序无法成立。', stepId: step.id, moduleId: module.id });
        }
      }
      if (step.kind === '练习' && (!step.exercise.trim() || !step.exerciseFeedback.trim())) {
        checks.push({ id: `practice-${step.id}`, severity: 'warning', title: `${step.title} 的练习反馈不完整`, detail: '练习任务需要明确完成动作和即时反馈方式。', stepId: step.id, moduleId: module.id });
      }
      if (step.commonMistakes.filter(Boolean).length === 0) {
        checks.push({ id: `mistakes-${step.id}`, severity: 'info', title: `${step.title} 尚未记录常见错误`, detail: '补充常见错误有助于教师现场提示。', stepId: step.id, moduleId: module.id });
      }
    });
  });

  return checks;
}

export function cloneProject(project: CourseProject): CourseProject {
  return structuredClone(project);
}

type FixTicketHost = { fixTickets?: FixTicket[] };

function findFixTicketHost(project: CourseProject, ticket: Pick<FixTicket, 'stepId' | 'moduleId'>): FixTicketHost | undefined {
  if (ticket.stepId) {
    for (const module of project.modules) {
      const step = module.steps.find((item) => item.id === ticket.stepId);
      if (step) return step;
    }
  }
  if (ticket.moduleId) {
    const module = project.modules.find((item) => item.id === ticket.moduleId);
    if (module) return module;
  }
  return project;
}

function ticketSnapshot(ticket: FixTicket): FixTicketSnapshot {
  return { owner: ticket.owner, note: ticket.note, recheckAt: ticket.recheckAt };
}

/**
 * 对账处理单：当前仍存在的每个阻断检查都必须有一张处理单。
 * - 新出现的阻断：自动建单（待处理）。
 * - 已标记修正、但同一步骤编辑后问题再次出现：回到待处理并追加复发记录，旧说明与历史保留。
 */
export function reconcileFixTickets(project: CourseProject, now: string = new Date().toISOString()): void {
  const activeErrors = new Map<string, ValidationCheck>();
  for (const check of validateProject(project)) {
    if (check.severity === 'error') activeErrors.set(check.id, check);
  }

  for (const bucket of collectFixTicketBuckets(project)) {
    for (const ticket of bucket.tickets) {
      const check = activeErrors.get(ticket.checkId);
      if (check && ticket.status === 'fixed') {
        ticket.status = 'open';
        ticket.recurrenceCount += 1;
        ticket.updatedAt = now;
        ticket.history.push({
          at: now,
          type: 'reopened',
          reason: '同一问题在后续编辑中再次出现',
          snapshot: ticketSnapshot(ticket),
        });
      }
      activeErrors.delete(ticket.checkId);
    }
  }

  for (const check of activeErrors.values()) {
    const host = findFixTicketHost(project, check) ?? project;
    host.fixTickets ??= [];
    const snapshot: FixTicketSnapshot = { owner: '', note: '', recheckAt: '' };
    host.fixTickets.push({
      ...snapshot,
      checkId: check.id,
      severity: 'error',
      title: check.title,
      detail: check.detail,
      stepId: check.stepId,
      moduleId: check.moduleId,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      recurrenceCount: 0,
      history: [{ at: now, type: 'created', snapshot }],
    });
  }
}

function collectFixTicketBuckets(project: CourseProject): { host: FixTicketHost; tickets: FixTicket[] }[] {
  const buckets: { host: FixTicketHost; tickets: FixTicket[] }[] = [];
  for (const module of project.modules) {
    for (const step of module.steps) {
      if (step.fixTickets?.length) buckets.push({ host: step, tickets: step.fixTickets });
    }
    if (module.fixTickets?.length) buckets.push({ host: module, tickets: module.fixTickets });
  }
  if (project.fixTickets?.length) buckets.push({ host: project, tickets: project.fixTickets });
  return buckets;
}

export function collectFixTickets(project: CourseProject): FixTicketView[] {
  const activeErrors = new Set(validateProject(project).filter((check) => check.severity === 'error').map((check) => check.id));
  const views: FixTicketView[] = [];
  for (const { tickets } of collectFixTicketBuckets(project)) {
    for (const ticket of tickets) {
      views.push({ ...ticket, active: activeErrors.has(ticket.checkId) });
    }
  }
  return views;
}

export function updateFixTicketInProject(
  project: CourseProject,
  checkId: string,
  patch: Partial<Pick<FixTicket, 'owner' | 'note' | 'recheckAt'>>,
  options: { record?: boolean; now?: string } = {},
): boolean {
  const now = options.now ?? new Date().toISOString();
  for (const bucket of collectFixTicketBuckets(project)) {
    const ticket = bucket.tickets.find((item) => item.checkId === checkId);
    if (!ticket) continue;
    Object.assign(ticket, patch);
    ticket.updatedAt = now;
    if (options.record) {
      ticket.history.push({ at: now, type: 'updated', snapshot: ticketSnapshot(ticket) });
    }
    return true;
  }
  return false;
}

export function markFixTicketFixed(project: CourseProject, checkId: string, now: string = new Date().toISOString()): 'ok' | 'not-found' | 'still-failing' {
  for (const bucket of collectFixTicketBuckets(project)) {
    const ticket = bucket.tickets.find((item) => item.checkId === checkId);
    if (!ticket) continue;
    const stillFailing = validateProject(project).some((check) => check.severity === 'error' && check.id === ticket.checkId);
    if (stillFailing) return 'still-failing';
    ticket.status = 'fixed';
    ticket.updatedAt = now;
    ticket.history.push({ at: now, type: 'fixed', snapshot: ticketSnapshot(ticket) });
    return 'ok';
  }
  return 'not-found';
}

export function reopenFixTicket(project: CourseProject, checkId: string, now: string = new Date().toISOString()): boolean {
  for (const bucket of collectFixTicketBuckets(project)) {
    const ticket = bucket.tickets.find((item) => item.checkId === checkId);
    if (!ticket) continue;
    if (ticket.status === 'fixed') {
      ticket.status = 'open';
      ticket.updatedAt = now;
      ticket.history.push({ at: now, type: 'reopened', reason: '教师手动退回待处理', snapshot: ticketSnapshot(ticket) });
    }
    return true;
  }
  return false;
}

/** 阻断处理单中「仍存在且待处理」的数量；大于零时不允许提交复核或冻结。 */
export function pendingBlockingTickets(project: CourseProject): FixTicketView[] {
  return collectFixTickets(project).filter((ticket) => ticket.status === 'open' && ticket.active);
}
