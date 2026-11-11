<?php

test('without a dsn the page carries no sentry settings, so the browser does not report', function () {
    config(['sentry.dsn' => null]);

    $this->get(route('login'))
        ->assertOk()
        ->assertDontSee('name="sentry-dsn"', false);
});

test('with a dsn the page hands the browser the dsn and the environment', function () {
    config([
        'sentry.dsn' => 'https://public@o1.ingest.sentry.io/1',
        'sentry.environment' => 'acceptance',
        'sentry.release' => null,
    ]);

    $this->get(route('login'))
        ->assertOk()
        ->assertSee('<meta name="sentry-dsn" content="https://public@o1.ingest.sentry.io/1">', false)
        ->assertSee('<meta name="sentry-environment" content="acceptance">', false)
        ->assertDontSee('name="sentry-release"', false);
});
