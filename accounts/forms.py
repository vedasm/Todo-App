from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

User = get_user_model()

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        field = ('username', 'email', 'password', 'confirmPassword')
        
    def clean_email(self):
        email = self.cleaned_data['data']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
    
class EmailUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email',)
        
    
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('instance', None)
        super().__init__(*args, instance=self.user, **kwargs)
        
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exclude(pk=self.user.pk).exists():
            raise forms.ValidationError("That email is already in use.")
        return email
    
class DeleteAccountForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput, label='Confirm password')
    
    