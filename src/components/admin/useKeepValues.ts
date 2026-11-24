'use client';

import { startTransition, type FormEvent } from 'react';

/* React 19 resets a form after its `action` runs, which would wipe an admin's
   edits whenever the server sends back a validation error. Submitting through
   onSubmit keeps what they typed. The clicked button's name and value (for
   example intent=publish) are still sent. */
export function useKeepValues(dispatch: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const fd = new FormData(e.currentTarget, submitter);
    startTransition(() => dispatch(fd));
  };
}
