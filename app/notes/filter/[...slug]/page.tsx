import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { fetchNotes } from '@/lib/api';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug[0] ?? 'all';

  const title =
    filter === 'all' ? 'All notes | NoteHub' : `${filter} notes | NoteHub`;

  const description =
    filter === 'all'
      ? 'Browse all notes in NoteHub'
      : `Browse notes with the ${filter} tag in NoteHub`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 800,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const filterValue = slug[0];

  const tag: NoteTag | undefined = NOTE_TAGS.includes(filterValue as NoteTag) 
    ? (filterValue as NoteTag) 
    : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: undefined,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag}/>
    </HydrationBoundary>
  );
}
