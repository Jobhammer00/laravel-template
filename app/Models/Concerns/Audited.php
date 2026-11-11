<?php

namespace App\Models\Concerns;

use App\Enums\AuditArea;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

trait Audited
{
    use LogsActivity;

    abstract public function auditArea(): AuditArea;

    /**
     * Stored with the entry, so it stays readable after a rename or delete.
     */
    abstract public function auditLabel(): string;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName($this->auditArea())
            ->logOnly($this->auditedAttributes())
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function beforeActivityLogged(Activity $activity, string $event): void
    {
        $activity->properties = collect($activity->properties)->put('object', $this->auditLabel());
    }

    /**
     * @return list<string>
     */
    abstract protected function auditedAttributes(): array;
}
