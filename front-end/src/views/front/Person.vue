<template>
  <div class="main-content">
    <el-card style="width: 50%; margin: 30px auto">
      <div style="text-align: right; margin-bottom: 20px">
        <el-button type="primary" @click="updatePassword">Reset Password</el-button>
      </div>
      <el-form :model="user" label-width="80px" style="padding-right: 20px">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="Username" prop="username">
          <el-input v-model="user.username" placeholder="Username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="user.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="user.phone" placeholder="Phone"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" placeholder="Email"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">SAVE</el-button>
        </div>
      </el-form>
    </el-card>
    <el-dialog title="Reset Password" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="user" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item label="Current Password" prop="password">
          <el-input show-password v-model="user.password" placeholder="Current Password"></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input show-password v-model="user.newPassword" placeholder="New Password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input show-password v-model="user.confirmPassword" placeholder="Confirm Password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please confirm your password'));
      } else if (value !== this.user.newPassword) {
        callback(new Error('Password confirmation does not match'));
      } else {
        callback();
      }
    };

    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      dialogVisible: false,
      rules: {
        password: [
          { required: true, message: 'Please enter your current password', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: 'Please enter a new password', trigger: 'blur' },
        ],
        confirmPassword: [
          { validator: validatePassword, required: true, trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    update() {//个人信息更改 要先判断是用户还是管理员
      let url;
      if(this.user.role==='ADMIN'){
        url = '/admin/update';
      }else{
        url = '/user/update';
      }
      // Save the current user information to the database
      this.$request.put(url, this.user).then(res => {
        if (res.code === '200') {
          this.$message.success('Save successful');
          localStorage.setItem('xm-user', JSON.stringify(this.user));
          this.$emit('update:user');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleAvatarSuccess(response, file, fileList) {
      this.$set(this.user, 'avatar', response.data)
    },

    updatePassword() {
      this.dialogVisible = true;
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request.put('/updatePassword', this.user).then(res => {
            if (res.code === '200') {
              this.$message.success('Password changed successfully');
              this.$router.push('/login');
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-weight: bold;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
</style>
