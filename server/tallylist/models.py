from server.settings import COFFEE_PRICE
from django.db import models
from authentication.models import Account
from django.utils import timezone


class TallyListEntry(models.Model):
    user = models.ForeignKey(Account)
    amount = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now=True)
    processed = models.BooleanField("check if the entry has been booked yet.",
                                    default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.user.balance -= COFFEE_PRICE * self.amount
            self.user.save()
        super(TallyListEntry, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.user.balance += COFFEE_PRICE * self.amount
        self.user.save()

        super(TallyListEntry, self).delete(*args, **kwargs)

    def __unicode__(self):
        return "%d for %s" % (self.amount, unicode(self.user))

    def is_deletable(self):
        return (not self.processed) and ((timezone.now() - self.created_at).total_seconds() < 1800)