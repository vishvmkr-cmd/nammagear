import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark' | 'outline' | 'ghost' | 'forest' | 'wa' | 'cream' | 'outline-cream';
  size?: 'default' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'dark', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-sans font-medium text-center transition-all duration-200 cursor-pointer border-[0.5px] border-transparent whitespace-nowrap',
          {
            'px-[18px] py-2.5 text-[13px]': size === 'default',
            'px-7 py-[15px] text-[14px]': size === 'lg',
            'px-[34px] py-[18px] text-[15px]': size === 'xl',
          },
          {
            'bg-ink text-bg hover:bg-forest hover:text-white hover:-translate-y-0.5': variant === 'dark',
            'bg-transparent text-ink border-[var(--line-strong)] hover:bg-ink hover:text-bg hover:border-ink': variant === 'outline',
            'bg-transparent text-ink-soft px-1': variant === 'ghost',
            'bg-forest text-white hover:bg-forest-2 hover:-translate-y-0.5': variant === 'forest',
            'bg-[#E8F5EC] text-[#0a6830] border-[#B8E0C2] hover:bg-[#d4edd8]': variant === 'wa',
            'bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#F59E0B] hover:text-white': variant === 'cream',
            'bg-transparent text-white border-[rgba(250,250,250,0.4)] hover:border-white hover:bg-[rgba(250,250,250,0.06)]': variant === 'outline-cream',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
