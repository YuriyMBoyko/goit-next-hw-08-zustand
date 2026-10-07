'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createNote, type CreateNoteParams } from '@/lib/api';
import { useNoteStore } from '@/lib/store/NoteStore';
import { type NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
    onError: (error) => {
      console.log('Failed to create note:', error);
    }
  });

  const formAction = (formData: FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const tag = formData.get('tag');

    if (
      typeof title !== 'string' ||
      title.trim() === '' ||
      typeof content !== 'string' ||
      typeof tag !== 'string'
    ) { return; }

    createMutation.mutate({ 
      title: title.trim(), 
      content: content.trim(),
      tag: tag as NoteTag
    });
  };

  return (
    <>
      <form className={css.form} action={formAction}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className={css.input}
            placeholder="Add title"
            defaultValue={draft.title}
            onChange={event => setDraft({ ...draft, title: event.target.value })}
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="content">Content </label>
          <textarea
            name="content"
            id="content"
            className={css.textarea}
            placeholder="Add content"
            defaultValue={draft.content}
            onChange={event => setDraft({ ...draft, content: event.target.value }) }
          ></textarea>
        </div>
        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            name="tag"
            id="tag"
            className={css.select}
            defaultValue={draft.tag}
            onChange={event => setDraft({ ...draft, tag: event.target.value as NoteTag }) }
          >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        </div>
        <div className={css.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className={css.submitButton}
          >
            Create note
          </button>
        </div>
      </form>
    </>
  );
}
