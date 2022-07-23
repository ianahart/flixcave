from rest_framework import serializers

from account.models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = (
            'first_name',
            'last_name',
            'email',
            'password',
            'confirm_password',
            'is_active',
        )
        extra_kwargs = {
            'confirm_password': {'write_only': True},
        }

    def validate_first_name(self, first_name: str):
        if len(first_name) == 0:
            raise serializers.ValidationError('First name cannot be empty.')
        elif len(first_name) > 200:
            raise serializers.ValidationError(
                'First name cannot exceed 200 characters.')
        return first_name.strip().capitalize()

    def validate_last_name(self, last_name: str):
        if len(last_name) == 0:
            raise serializers.ValidationError('Last name cannot be empty.')
        elif len(last_name) > 200:
            raise serializers.ValidationError(
                'Last name cannot exceed 200 characters.')
        return last_name.strip().capitalize()

    def validate(self, data: dict[str, str]):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {'password': ['Passwords do not match.']})
        return data

    def validate_password(self, password: str):
        l_case, u_case, digit = False, False, False,
        for char in password:
            if char.isdigit():
                digit = True
            elif char.lower() == char:
                l_case = True
            elif char.upper() == char:
                u_case = True

        if not all(req for req in [l_case, u_case, digit]):
            raise serializers.ValidationError(
                'Please include 1 uppercase, 1 lowercase and 1 number in your password.')
        return password
