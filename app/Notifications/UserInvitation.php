<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Password;

/**
 * The token is made in toMail, so the plain token never sits in the queue.
 */
class UserInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @return list<string>
     */
    public function via(User $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(User $notifiable): MailMessage
    {
        $minutes = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');

        return (new MailMessage)
            ->subject('Je account voor de ' . config('app.name') . ' beheeromgeving')
            ->greeting('Hallo ' . $notifiable->name . ',')
            ->line('Er is een account voor je aangemaakt in de ' . config('app.name') . ' beheeromgeving.')
            ->action('Wachtwoord instellen', route('password.reset', [
                'token' => Password::createToken($notifiable),
                'email' => $notifiable->email,
            ]))
            ->line("Deze link is {$minutes} minuten geldig. Verlopen? Vraag via \"Wachtwoord vergeten\" op de inlogpagina een nieuwe aan.");
    }
}
