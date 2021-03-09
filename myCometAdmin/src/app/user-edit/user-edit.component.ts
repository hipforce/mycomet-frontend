import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../shared/models/userModel';
import { UserService } from '../shared/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackService } from '../shared/services/snack.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  isEdit: boolean = false;

  userForm = new FormGroup ({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    phoneNbr: new FormControl('', [Validators.required]),
    isAdmin: new FormControl('', [Validators.required]),
    profilePicture: new FormControl('', [Validators.required]),
    cometId: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private snackService: SnackService) { }
  userId: number;
  user: User;
  ngOnInit() {
    this.userForm.disable();
    this.activatedRoute.params.subscribe( params => this.userId = params.id );
    this.userService.getUser(this.userId).subscribe(res => {
      this.user = res;
      this.userForm.patchValue(this.user);
    },
    err => {

    });
  }

  update() {
    const temp = this.userForm.getRawValue();
    this.userService.updateUser(this.userId, temp).subscribe(res => {
      this.changeEdit();
      this.snackService.openSnackBar();
    },
    err => {

    });
  }

  changeEdit() {
    if (this.isEdit) {
      this.isEdit = false;
      this.userForm.disable();
    } else {
      this.isEdit = true;
      this.userForm.enable();
    }
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.userService.deleteUser(this.userId).subscribe(res => {
          this.snackService.openSnackBar();
          this.router.navigateByUrl('/dashboard');
        });
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

}