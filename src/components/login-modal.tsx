import { auth, signIn } from '@/auth'
import { Button } from './ui/button';

const Modal = async () => {
   const session = await auth();
   if (session) return null;
   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
         <div className="bg-neutral-900 text-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2">Welcome back</h2>
            <p className="mb-4">In order to use Manimorph, please sign in</p>
            <form action={async () => {
                     "use server";

                     await signIn("google");
                  }}>
                     <Button type='submit' className='bg-white text-black hover:bg-zinc-200 h-9 rounded-full w-full'>
                        Sign In
                     </Button>
            </form>
         </div>
      </div>
   )
}

export default Modal
