import type { Metadata } from 'next';
import KernelWorkspace from '@/components/secondbrain-kernel/KernelWorkspace';

export const metadata: Metadata = {
  title: 'SecondBrain Kernel · Local-First 워크스페이스',
};

export default function SecondBrainKernelPage() {
  return <KernelWorkspace />;
}
