# Generated by Django 4.2.5 on 2023-10-20 12:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import plane.db.models.api
import plane.db.models.webhook
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0045_issueactivity_epoch_workspacemember_issue_props_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Webhook',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('url', models.URLField(validators=[plane.db.models.webhook.validate_schema, plane.db.models.webhook.validate_domain])),
                ('is_active', models.BooleanField(default=True)),
                ('secret_key', models.CharField(blank=True, max_length=255, null=True)),
                ('project', models.BooleanField(default=False)),
                ('issue', models.BooleanField(default=False)),
                ('module', models.BooleanField(default=False)),
                ('cycle', models.BooleanField(default=False)),
                ('issue_comment', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL, verbose_name='Last Modified By')),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workspace_webhooks', to='db.workspace')),
            ],
            options={
                'verbose_name': 'Webhook',
                'verbose_name_plural': 'Webhooks',
                'db_table': 'webhooks',
                'ordering': ('-created_at',),
                'unique_together': {('workspace', 'url')},
            },
        ),
        migrations.AddField(
            model_name='apitoken',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='apitoken',
            name='expired_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='apitoken',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='apitoken',
            name='last_used',
            field=models.DateTimeField(null=True),
        ),
        migrations.CreateModel(
            name='WebhookLog',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('event_type', models.CharField(blank=True, max_length=255, null=True)),
                ('request_method', models.CharField(blank=True, max_length=10, null=True)),
                ('request_headers', models.TextField(blank=True, null=True)),
                ('request_body', models.TextField(blank=True, null=True)),
                ('response_status', models.TextField(blank=True, null=True)),
                ('response_headers', models.TextField(blank=True, null=True)),
                ('response_body', models.TextField(blank=True, null=True)),
                ('retry_count', models.PositiveSmallIntegerField(default=0)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL, verbose_name='Last Modified By')),
                ('webhook', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='db.webhook')),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='webhook_logs', to='db.workspace')),
            ],
            options={
                'verbose_name': 'Webhook Log',
                'verbose_name_plural': 'Webhook Logs',
                'db_table': 'webhook_logs',
                'ordering': ('-created_at',),
            },
        ),
        migrations.CreateModel(
            name='APIActivityLog',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('token_identifier', models.CharField(max_length=255)),
                ('path', models.CharField(max_length=255)),
                ('method', models.CharField(max_length=10)),
                ('query_params', models.TextField(blank=True, null=True)),
                ('headers', models.TextField(blank=True, null=True)),
                ('body', models.TextField(blank=True, null=True)),
                ('response_code', models.PositiveIntegerField()),
                ('response_body', models.TextField(blank=True, null=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user_agent', models.CharField(blank=True, max_length=512, null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL, verbose_name='Last Modified By')),
            ],
            options={
                'verbose_name': 'API Activity Log',
                'verbose_name_plural': 'API Activity Logs',
                'db_table': 'api_activity_logs',
                'ordering': ('-created_at',),
            },
        ),
        migrations.AlterField(
            model_name='issueproperty',
            name='properties',
            field=models.JSONField(default=plane.db.models.issue.get_default_properties),
        ),
    ]